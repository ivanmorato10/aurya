import { defineConfig, devices } from "@playwright/test";

// E2E contra o build de produção e o SIMULADOR local do Supabase.
// Nunca aponta para um projeto Supabase real.
const MOCK = "http://127.0.0.1:54399";
const APP_PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${APP_PORT}`, trace: "retain-on-failure", locale: "pt-BR", timezoneId: "America/Sao_Paulo" },
  projects: [
    { name: "celular", use: { ...devices["Pixel 7"] } },
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
  ],
  webServer: [
    { command: "node tests/e2e/mock-supabase.mjs", url: `${MOCK}/__control`, reuseExistingServer: false },
    {
      command: `npx next build && npx next start -p ${APP_PORT}`,
      url: `http://localhost:${APP_PORT}/privacidade`,
      timeout: 240_000,
      reuseExistingServer: false,
      env: {
        NEXT_PUBLIC_SUPABASE_URL: MOCK,
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_mock",
        NEXT_DIST_DIR: ".next-e2e",
      },
    },
  ],
});
