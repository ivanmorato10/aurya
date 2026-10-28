// SIMULADOR LOCAL do Supabase, usado apenas nos testes E2E (Playwright).
// Implementa só os endpoints que o AURYA chama: OTP, verify, user, logout,
// profiles (GET/PATCH) e rpc/delete_my_account. Não substitui o Supabase real:
// RLS e constraints reais são testadas em supabase/tests/rls.test.sql.
import { createServer } from "node:http";
import { randomUUID } from "node:crypto";

const PORT = Number(process.env.MOCK_SUPABASE_PORT ?? 54399);
const CODE = "123456";

const users = new Map(); // email -> { id, email }
const profiles = new Map(); // id -> row
const lastOtp = new Map(); // email -> timestamp
const tokens = new Map(); // access_token -> user id
let failWrites = false;

const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");

function session(user) {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const access = `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: user.id, email: user.email, role: "authenticated", aud: "authenticated", exp, iat: exp - 3600, session_id: randomUUID() })}.mock`;
  tokens.set(access, user.id);
  return {
    access_token: access,
    token_type: "bearer",
    expires_in: 3600,
    expires_at: exp,
    refresh_token: randomUUID(),
    user: userJson(user),
  };
}

const userJson = (u) => ({ id: u.id, aud: "authenticated", role: "authenticated", email: u.email, app_metadata: {}, user_metadata: {}, created_at: new Date().toISOString() });

function send(res, status, body, extra = {}) {
  res.writeHead(status, {
    "content-type": "application/json",
    "access-control-allow-origin": "*",
    "access-control-allow-headers": "*",
    "access-control-allow-methods": "GET,POST,PATCH,DELETE,OPTIONS",
    ...extra,
  });
  res.end(body === undefined ? "" : JSON.stringify(body));
}

const bearerUser = (req) => {
  const token = (req.headers.authorization ?? "").replace(/^Bearer /, "");
  const id = tokens.get(token);
  return id ? [...users.values()].find((u) => u.id === id) : null;
};

const readBody = (req) =>
  new Promise((resolve) => {
    let data = "";
    req.on("data", (c) => (data += c));
    req.on("end", () => resolve(data ? JSON.parse(data) : {}));
  });

const TIME = /^([01]\d|2[0-3]):[0-5]\d(:00)?$/;

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  if (req.method === "OPTIONS") return send(res, 204);
  const body = ["POST", "PATCH"].includes(req.method) ? await readBody(req) : {};

  // Controle do teste
  if (url.pathname === "/__control") {
    if (body.reset) {
      users.clear();
      profiles.clear();
      lastOtp.clear();
      tokens.clear();
    }
    if ("failWrites" in body) failWrites = body.failWrites;
    return send(res, 200, { ok: true, users: users.size, profiles: profiles.size });
  }

  // ---- Auth ----
  if (url.pathname === "/auth/v1/otp" && req.method === "POST") {
    const email = String(body.email ?? "").toLowerCase();
    if (Date.now() - (lastOtp.get(email) ?? 0) < 60_000) {
      return send(res, 429, { code: "over_email_send_rate_limit", msg: "For security purposes, you can only request this after 60 seconds." });
    }
    lastOtp.set(email, Date.now());
    return send(res, 200, {});
  }
  if (url.pathname === "/auth/v1/verify" && req.method === "POST") {
    const email = String(body.email ?? "").toLowerCase();
    if (body.token !== CODE || !lastOtp.has(email)) return send(res, 403, { code: "otp_expired", msg: "Token has expired or is invalid" });
    let user = users.get(email);
    if (!user) {
      user = { id: randomUUID(), email };
      users.set(email, user);
      profiles.set(user.id, { id: user.id, display_name: null, time_zone: "America/Sao_Paulo", wake_time: null, commute_time: null, midday_time: null, sleep_time: null, message_types: ["prosperidade", "confianca", "proposito", "gratidao"], include_quotes: true });
    }
    return send(res, 200, session(user));
  }
  if (url.pathname === "/auth/v1/user" && req.method === "GET") {
    const user = bearerUser(req);
    return user ? send(res, 200, userJson(user)) : send(res, 401, { code: "bad_jwt", msg: "invalid JWT" });
  }
  if (url.pathname === "/auth/v1/logout") return send(res, 204);

  // ---- PostgREST ----
  const user = bearerUser(req);
  if (url.pathname === "/rest/v1/profiles") {
    if (!user) return send(res, 401, { code: "42501", message: "permission denied" });
    const idFilter = url.searchParams.get("id")?.replace(/^eq\./, "");
    // Mesma regra da RLS: só a própria linha.
    const rows = [...profiles.values()].filter((p) => p.id === user.id && (!idFilter || p.id === idFilter));
    if (req.method === "GET") return send(res, 200, rows);
    if (req.method === "PATCH") {
      if (failWrites) return send(res, 503, { code: "PGRST000", message: "simulated outage" });
      const allowed = ["display_name", "time_zone", "wake_time", "commute_time", "midday_time", "sleep_time", "message_types", "include_quotes"];
      if (Object.keys(body).some((k) => !allowed.includes(k))) return send(res, 403, { code: "42501", message: "permission denied" });
      const times = ["wake_time", "commute_time", "midday_time", "sleep_time"].map((k) => body[k]);
      const touchesTimes = times.some((t) => t !== undefined);
      const badTimes = touchesTimes && (times.some((t) => !TIME.test(t ?? "")) || new Set(times).size !== 4);
      const badTypes = "message_types" in body && (!Array.isArray(body.message_types) || body.message_types.length === 0);
      if (badTimes || badTypes) return send(res, 400, { code: "23514", message: "check constraint" });
      for (const row of rows) Object.assign(row, body);
      return send(res, 200, rows.map((r) => ({ id: r.id })));
    }
  }
  if (url.pathname === "/rest/v1/rpc/delete_my_account" && req.method === "POST") {
    if (!user) return send(res, 401, { code: "42501", message: "not authenticated" });
    users.delete(user.email);
    profiles.delete(user.id);
    for (const [t, id] of tokens) if (id === user.id) tokens.delete(t);
    return send(res, 204);
  }

  send(res, 404, { message: `mock: rota não implementada ${req.method} ${url.pathname}` });
}).listen(PORT, "127.0.0.1", () => console.log(`mock supabase em http://127.0.0.1:${PORT}`));
