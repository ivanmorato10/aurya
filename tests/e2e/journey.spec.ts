import { expect, test, type Page } from "@playwright/test";

const MOCK = "http://127.0.0.1:54399";
const control = (page: Page, body: object) => page.request.post(`${MOCK}/__control`, { data: body });
const email = (tag: string) => `${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

async function noHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
}

async function login(page: Page, address: string) {
  await page.getByLabel("Seu e-mail").fill(address);
  await page.getByRole("button", { name: "Receber código" }).click();
  await expect(page.getByLabel("Código de acesso")).toBeFocused();
  await page.getByLabel("Código de acesso").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
}

async function onboard(page: Page) {
  await expect(page).toHaveURL(/\/comecar/);
  await page.getByLabel("Ao acordar").fill("06:45");
  await page.getByLabel("Indo para o trabalho").fill("08:15");
  await page.getByLabel("Meio do dia").fill("13:00");
  await page.getByLabel("Antes de dormir").fill("23:00");
  await page.getByRole("button", { name: "Começar" }).click();
}

test.beforeAll(async ({ request }) => {
  await request.post(`${MOCK}/__control`, { data: { reset: true, failWrites: false } });
});

test("jornada principal: entrar, definir horários, ler e aprofundar", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Uma frase.");
  await noHorizontalScroll(page);
  await page.screenshot({ path: `test-results/screens/${info.project.name}-1-landing.png`, fullPage: true });

  await page.getByRole("link", { name: "Começar com meu e-mail" }).click();
  await expect(page).toHaveURL(/\/entrar/);

  // E-mail inválido
  await page.getByLabel("Seu e-mail").fill("ana@");
  await page.getByRole("button", { name: "Receber código" }).click();
  await expect(page.locator("p[role=alert]")).toContainText("e-mail válido");

  // Código errado, depois certo
  const address = email("ana");
  await page.getByLabel("Seu e-mail").fill(address);
  await page.getByRole("button", { name: "Receber código" }).click();
  await expect(page.getByRole("status")).toContainText(address);
  await page.screenshot({ path: `test-results/screens/${info.project.name}-2-codigo.png`, fullPage: true });
  await page.getByLabel("Código de acesso").fill("000000");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page.locator("p[role=alert]")).toContainText("Código inválido");

  // Reenvio respeita o intervalo
  await expect(page.getByRole("button", { name: /Reenviar em \d+s/ })).toBeDisabled();

  await page.getByLabel("Código de acesso").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();

  // Onboarding: horários repetidos são recusados e o formulário preserva os valores
  await expect(page).toHaveURL(/\/comecar/);
  await page.getByLabel("Antes de dormir").fill("06:45");
  await page.getByLabel("Ao acordar").fill("06:45");
  await page.getByLabel(/Como podemos chamar/).fill("Ana");
  await page.getByRole("button", { name: "Começar" }).click();
  await expect(page.getByText("Use quatro horários diferentes.")).toBeVisible();
  await expect(page.getByLabel(/Como podemos chamar/)).toHaveValue("Ana");
  await noHorizontalScroll(page);
  await page.screenshot({ path: `test-results/screens/${info.project.name}-3-onboarding-erro.png`, fullPage: true });

  await page.getByLabel("Antes de dormir").fill("23:00");
  await page.getByRole("button", { name: "Começar" }).click();

  // Hoje
  await expect(page).toHaveURL(/\/hoje/);
  await expect(page.getByRole("heading", { name: "Olá, Ana." })).toBeVisible();
  await expect(page.locator(".affirmation-text")).not.toBeEmpty();
  await expect(page.getByText(/Próxima troca:/)).toBeVisible();
  await noHorizontalScroll(page);
  await page.screenshot({ path: `test-results/screens/${info.project.name}-4-hoje.png`, fullPage: true });

  // Prévia de outro momento e volta
  const current = (await page.locator(".timeline button[aria-pressed=true] time").textContent())!;
  const other = page.locator(".timeline button[aria-pressed=false]").first();
  await other.click();
  await expect(page.getByText("Prévia de outro momento")).toBeVisible();
  await page.getByRole("button", { name: "← Voltar ao momento atual" }).click();
  await expect(page.locator(".timeline button[aria-pressed=true] time")).toHaveText(current);

  // Aprofundar
  const phrase = await page.locator(".affirmation-text").innerText();
  await page.getByRole("link", { name: "Aprofundar" }).click();
  await expect(page).toHaveURL(/\/reflexao\//);
  await expect(page.locator(".lead").first()).toHaveText(phrase);
  await expect(page.locator(".reflection-text p").first()).not.toBeEmpty();
  await expect(page.getByRole("button", { name: "Ouvir" })).toBeEnabled();
  await noHorizontalScroll(page);
  await page.screenshot({ path: `test-results/screens/${info.project.name}-5-reflexao.png`, fullPage: true });

  // Sessão persiste ao recarregar
  await page.reload();
  await expect(page.locator(".reflection-text")).toBeVisible();
});

test("rotas privadas exigem login e o deep link de reflexão é retomado", async ({ page }) => {
  await page.goto("/hoje");
  await expect(page).toHaveURL(/\/entrar\?next=%2Fhoje/);

  await page.goto("/reflexao/sleep-descanso-01");
  await expect(page).toHaveURL(/\/entrar\?next=%2Freflexao%2Fsleep-descanso-01/);
  await login(page, email("link"));
  await onboard(page);
  await expect(page).toHaveURL(/\/reflexao\/sleep-descanso-01/);

  // Id desconhecido
  await page.goto("/reflexao/nao-existe");
  await expect(page.getByText("Esta reflexão não está disponível.")).toBeVisible();

  // Redirecionamento externo é ignorado
  await page.goto("/");
  await expect(page).toHaveURL(/\/hoje/);
});

test("conta: falha de gravação preserva dados; depois salva; sair", async ({ page }, info) => {
  await page.goto("/entrar");
  await login(page, email("conta"));
  await onboard(page);
  await expect(page).toHaveURL(/\/hoje/);

  await page.getByRole("link", { name: "Conta" }).click();
  await expect(page).toHaveURL(/\/conta/);
  await page.getByLabel("Meio do dia").fill("12:10");
  await page.getByLabel(/Como podemos chamar/).fill("Bia");

  await control(page, { failWrites: true });
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.locator("p[role=alert]").filter({ hasText: "Não foi possível salvar" })).toBeVisible();
  await expect(page.getByLabel("Meio do dia")).toHaveValue("12:10");
  await expect(page.getByLabel(/Como podemos chamar/)).toHaveValue("Bia");

  await control(page, { failWrites: false });
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Horários salvos." })).toBeVisible();
  await noHorizontalScroll(page);
  await page.screenshot({ path: `test-results/screens/${info.project.name}-6-conta.png`, fullPage: true });

  await page.getByRole("link", { name: "Hoje" }).click();
  await expect(page.getByRole("heading", { name: "Olá, Bia." })).toBeVisible();
  await expect(page.locator(".timeline")).toContainText("12:10");

  await page.getByRole("link", { name: "Conta" }).click();
  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page).toHaveURL(/\/$/);
  await page.goto("/conta");
  await expect(page).toHaveURL(/\/entrar/);
});

test("áudios: escolher tema, faixa e temporizador", async ({ page }, info) => {
  await page.goto("/entrar");
  await login(page, email("audio"));
  await onboard(page);
  await page.getByRole("link", { name: "Áudios" }).click();
  await expect(page).toHaveURL(/\/audios/);
  await expect(page.getByText("Volume · 15%")).toBeVisible();

  await page.getByRole("button", { name: "Gratidão" }).click();
  await expect(page.getByRole("button", { name: "Gratidão" })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Encerrar após").selectOption("1");
  await expect(page.locator(".countdown")).toHaveText("01:00");

  // O arquivo de áudio é servido com o tipo correto
  const src = await page.locator("#melody").evaluate(() => "/audio/music-v3-528-1.m4a");
  const res = await page.request.get(src);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("audio");

  await page.getByRole("button", { name: "Reproduzir" }).click();
  await expect(page.locator("[role=status].player-status")).toHaveText(/Tocando|Não foi possível tocar/);
  await noHorizontalScroll(page);
  await page.screenshot({ path: `test-results/screens/${info.project.name}-7-audios.png`, fullPage: true });
});

test("excluir conta exige confirmação e apaga os dados", async ({ page }) => {
  const address = email("excluir");
  await page.goto("/entrar");
  await login(page, address);
  await onboard(page);
  await page.getByRole("link", { name: "Conta" }).click();

  await page.getByRole("button", { name: "Excluir minha conta" }).click();
  await page.getByLabel("Digite EXCLUIR para confirmar").fill("talvez");
  await page.getByRole("button", { name: "Excluir", exact: true }).click();
  await expect(page.locator("p[role=alert]").filter({ hasText: "Digite EXCLUIR" })).toBeVisible();

  await page.getByLabel("Digite EXCLUIR para confirmar").fill("EXCLUIR");
  await page.getByRole("button", { name: "Excluir", exact: true }).click();
  await expect(page).toHaveURL(/\?conta=excluida/);
  await expect(page.getByText("Sua conta e seus dados foram excluídos.")).toBeVisible();

  // Mesmo e-mail cria uma conta nova, sem horários antigos (aguarda o limite de reenvio do simulador)
  await control(page, { reset: true });
  await page.goto("/entrar");
  await login(page, address);
  await expect(page).toHaveURL(/\/comecar/);
});

test("limite de envio de código mostra mensagem compreensível", async ({ page }) => {
  const address = email("limite");
  await page.goto("/entrar");
  await page.getByLabel("Seu e-mail").fill(address);
  await page.getByRole("button", { name: "Receber código" }).click();
  await expect(page.getByLabel("Código de acesso")).toBeVisible();
  await page.getByRole("button", { name: "Trocar e-mail" }).click();
  await page.getByLabel("Seu e-mail").fill(address);
  await page.getByRole("button", { name: "Receber código" }).click();
  await expect(page.locator("p[role=alert]")).toContainText("Muitas tentativas");
  await expect(page.getByLabel("Seu e-mail")).toHaveValue(address);
});

test("sem rede ao enviar código: mensagem e e-mail preservado", async ({ page, context }) => {
  await page.goto("/entrar");
  const address = email("offline");
  await page.getByLabel("Seu e-mail").fill(address);
  await context.setOffline(true);
  await page.getByRole("button", { name: "Receber código" }).click();
  await expect(page.locator("p[role=alert]")).toContainText(/conexão|Não foi possível/);
  await expect(page.getByLabel("Seu e-mail")).toHaveValue(address);
  await context.setOffline(false);
});
