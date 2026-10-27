#!/usr/bin/env bash
# Sobe um Postgres temporário, aplica a migration sobre um stub do Auth e roda
# supabase/tests/rls.test.sql. Não toca em nenhum banco real.
# Requer binários do Postgres (initdb/pg_ctl/psql). Defina PG_BIN se não estiverem no PATH.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PG_BIN="${PG_BIN:-$(dirname "$(command -v initdb 2>/dev/null || ls -d /usr/lib/postgresql/*/bin/initdb 2>/dev/null | tail -1)")}"
TMP="$(mktemp -d)"
PORT="${PGTEST_PORT:-54329}"

cleanup() { "$PG_BIN/pg_ctl" -D "$TMP/data" -m immediate stop >/dev/null 2>&1 || true; rm -rf "$TMP"; }
trap cleanup EXIT

"$PG_BIN/initdb" -D "$TMP/data" -U postgres --auth=trust >/dev/null
"$PG_BIN/pg_ctl" -D "$TMP/data" -o "-p $PORT -k $TMP -c listen_addresses=''" -l "$TMP/log" -w start >/dev/null

PSQL=("$PG_BIN/psql" -h "$TMP" -p "$PORT" -U postgres -d postgres -v ON_ERROR_STOP=1 -q -X)
"${PSQL[@]}" -f "$ROOT/supabase/tests/auth_stub.sql"
for f in "$ROOT"/supabase/migrations/*.sql; do "${PSQL[@]}" -f "$f"; done
"${PSQL[@]}" -t -f "$ROOT/supabase/tests/rls.test.sql"
