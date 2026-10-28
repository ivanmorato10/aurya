import { expect, test, type Page } from "@playwright/test";

const MOCK = "http://127.0.0.1:54399";
const control = (page: Page, body: object) => page.request.post(`${MOCK}/__control`, { data: body });
const email = (tag: string) => `${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
const alertBox = (page: Page) => page.locator("p[role=alert]");
const shot = (page: Page, name: string, project: string) => page.screenshot({ path: `test-results/screens/${project}-${name}.png` });

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

async function onboard(page: Page, opts: { name?: string } = {}) {
  await expect(page.getByRole("heading", { name: "Seus horários" })).toBeVisible();
  await page.getByLabel("Ao acordar").fill("06:45");
  await page.getByLabel("Indo para o trabalho").fill("08:15");
  await page.getByLabel("Meio do dia").fill("13:00");
  await page.getByLabel("Antes de dormir").fill("23:00");
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByRole("heading", { name: "O que você quer receber?" })).toBeVisible();
  await page.getByRole("button", { name: "Continuar" }).click();
  if (opts.name) await page.getByLabel("Seu nome (opcional)").fill(opts.name);
  await page.getByRole("button", { name: "Começar" }).click();
  await expect(page).toHaveURL(/\/hoje/);
}

test.beforeAll(async ({ request }) => {
  await request.post(`${MOCK}/__control`, { data: { reset: true, failWrites: false } });
});

test("visitante: boas-vindas, como funciona, configurar sem conta e ler", async ({ page }, info) => {
  await page.goto("/");
  await expect(page.getByText("Quatro pausas para um dia mais próspero.")).toBeVisible();
  await noHorizontalScroll(page);
  await shot(page, "1-boas-vindas", info.project.name);

  await page.getByRole("link", { name: "Como funciona" }).click();
  await expect(page.getByText("Use sem cadastro")).toBeVisible();
  await shot(page, "2-como-funciona", info.project.name);
  await page.getByRole("link", { name: "Começar agora" }).click();

  // Passo 1: horários repetidos não avançam
  await page.getByLabel("Ao acordar").fill("06:45");
  await page.getByLabel("Antes de dormir").fill("06:45");
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Use quatro horários diferentes.")).toBeVisible();
  await page.getByLabel("Antes de dormir").fill("23:00");
  await expect(page.getByText("Use quatro horários diferentes.")).toHaveCount(0);
  await shot(page, "3-onboarding-horarios", info.project.name);
  await page.getByRole("button", { name: "Continuar" }).click();

  // Passo 2: pelo menos um tipo; escolhe só Gratidão, sem citações
  for (const label of ["Prosperidade e riqueza", "Confiança e ação", "Foco e propósito", "Gratidão"]) {
    await page.getByRole("checkbox", { name: new RegExp(label) }).uncheck();
  }
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByText("Escolha pelo menos um tipo de mensagem.")).toBeVisible();
  await page.getByRole("checkbox", { name: /Gratidão/ }).check();
  await page.getByRole("switch", { name: /Citações/ }).uncheck();
  await noHorizontalScroll(page);
  await shot(page, "4-onboarding-mensagens", info.project.name);
  await page.getByRole("button", { name: "Continuar" }).click();

  // Passo 3: nome; voltar preserva escolhas
  await page.getByLabel("Seu nome (opcional)").fill("Ana");
  await expect(page.getByText(/Sem cadastro: suas escolhas ficam neste aparelho/)).toBeVisible();
  await page.getByRole("button", { name: "Voltar" }).click();
  await expect(page.getByRole("checkbox", { name: /Gratidão/ })).toBeChecked();
  await page.getByRole("button", { name: "Continuar" }).click();
  await expect(page.getByLabel("Seu nome (opcional)")).toHaveValue("Ana");
  await page.getByRole("button", { name: "Começar" }).click();

  // Hoje
  await expect(page).toHaveURL(/\/hoje/);
  await expect(page.getByText(/, Ana$/)).toBeVisible();
  await expect(page.locator(".affirmation-text")).not.toBeEmpty();
  await expect(page.getByText(/Próxima troca/)).toBeVisible();
  await noHorizontalScroll(page);
  await shot(page, "5-hoje", info.project.name);
  for (const btn of await page.locator(".timeline button").all()) {
    await btn.click();
    await expect(page.getByText("Ver fonte")).toHaveCount(0);
  }

  // Preferências sobrevivem ao recarregar; "/" leva direto para Hoje
  await page.reload();
  await expect(page.getByText(/, Ana$/)).toBeVisible();
  await page.goto("/");
  await expect(page).toHaveURL(/\/hoje/);

  // Aprofundar sem conta
  const back = page.getByRole("button", { name: "← Voltar ao momento atual" });
  if (await back.isVisible()) await back.click();
  const phrase = await page.locator(".affirmation-text").innerText();
  await page.getByRole("link", { name: "Aprofundar" }).click();
  await expect(page.locator(".reflection-art .quote")).toHaveText(phrase);
  await expect(page.getByRole("button", { name: "Ouvir" })).toBeEnabled();
  await noHorizontalScroll(page);
  await shot(page, "6-reflexao", info.project.name);
});

test("visitante: ajustes salvam no aparelho", async ({ page }, info) => {
  await page.goto("/comecar");
  await onboard(page);
  await page.getByRole("link", { name: "Ajustes" }).click();
  await expect(page.getByText("Você está usando sem cadastro")).toBeVisible();
  await noHorizontalScroll(page);
  await shot(page, "7-ajustes-visitante", info.project.name);

  await page.getByRole("link", { name: /Horários/ }).click();
  await page.getByLabel("Meio do dia").fill("12:10");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Alterações salvas." })).toBeVisible();

  await page.goto("/conta/mensagens");
  await page.getByRole("checkbox", { name: /Confiança e ação/ }).uncheck();
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Alterações salvas." })).toBeVisible();
  await shot(page, "8-tipos", info.project.name);
  await page.reload();
  await expect(page.getByRole("checkbox", { name: /Confiança e ação/ })).not.toBeChecked();

  await page.goto("/hoje");
  await expect(page.locator(".timeline")).toContainText("12:10");
});

test("criar conta leva as preferências do aparelho; falha ao salvar preserva; sair mantém o app", async ({ page }) => {
  await page.goto("/comecar");
  await onboard(page, { name: "Bia" });
  await page.getByRole("link", { name: "Ajustes" }).click();
  await page.getByRole("link", { name: "Entrar ou criar conta" }).click();
  const address = email("conta");
  await login(page, address);
  await expect(page).toHaveURL(/\/conta$/);
  await expect(page.getByText(address)).toBeVisible();

  // Migração: a conta nova recebeu as preferências do aparelho
  await page.goto("/hoje");
  await expect(page.getByText(/, Bia$/)).toBeVisible();

  // Com conta: falha de gravação preserva o formulário; depois salva
  await page.goto("/conta/horarios");
  await page.getByLabel("Meio do dia").fill("12:20");
  await control(page, { failWrites: true });
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(alertBox(page).filter({ hasText: "Não foi possível salvar" })).toBeVisible();
  await expect(page.getByLabel("Meio do dia")).toHaveValue("12:20");
  await control(page, { failWrites: false });
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Alterações salvas." })).toBeVisible();

  // Sair: continua usando com as mesmas preferências neste aparelho
  await page.goto("/conta");
  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page.getByText("Você está usando sem cadastro")).toBeVisible();
  await page.goto("/hoje");
  await expect(page.locator(".timeline")).toContainText("12:20");
});

test("excluir conta exige confirmação e apaga conta e aparelho", async ({ page }) => {
  await page.goto("/entrar");
  await login(page, email("excluir"));
  await expect(page).toHaveURL(/\/comecar/);
  await onboard(page);
  await page.goto("/conta");
  await page.getByRole("link", { name: "Excluir conta" }).click();
  await page.getByLabel("Digite EXCLUIR para confirmar").fill("talvez");
  await page.getByRole("button", { name: "Excluir definitivamente" }).click();
  await expect(alertBox(page).filter({ hasText: "Digite EXCLUIR" })).toBeVisible();
  await page.getByLabel("Digite EXCLUIR para confirmar").fill("EXCLUIR");
  await page.getByRole("button", { name: "Excluir definitivamente" }).click();
  await expect(page).toHaveURL(/\?conta=excluida/);
  await expect(page.getByText("Sua conta e seus dados foram excluídos.")).toBeVisible();
  // Preferências do aparelho também foram apagadas: Hoje pede configuração
  await page.goto("/hoje");
  await expect(page).toHaveURL(/\/comecar/);
});

test("exclusão de conta exige login; reflexão desconhecida mostra aviso", async ({ page }) => {
  await page.goto("/conta/excluir");
  await expect(page).toHaveURL(/\/entrar\?next=%2Fconta%2Fexcluir/);
  await page.goto("/reflexao/nao-existe");
  await expect(page.getByText("Esta reflexão não está disponível.")).toBeVisible();
  await page.goto("/reflexao/sleep-descanso-01");
  await expect(page.locator(".reflection-text")).toBeVisible();
});

test("áudios sem conta: tema, temporizador e reprodução", async ({ page }, info) => {
  await page.goto("/audios");
  await expect(page.getByText("Volume · 15%")).toBeVisible();
  await page.getByRole("button", { name: "Gratidão" }).click();
  await expect(page.getByRole("button", { name: "Gratidão" })).toHaveAttribute("aria-pressed", "true");
  await page.getByLabel("Encerrar após").selectOption("1");
  await expect(page.locator(".artwork .time")).toHaveText("01:00");
  const res = await page.request.get("/audio/music-v3-528-1.m4a");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("audio");
  await page.getByRole("button", { name: "Reproduzir" }).click();
  await expect(page.locator(".player-status[role=status]")).toHaveText(/Tocando|Não foi possível tocar/);
  await noHorizontalScroll(page);
  await shot(page, "9-audios", info.project.name);
});

test("login: e-mail inválido, código errado, limite e sem rede", async ({ page, context }, info) => {
  await page.goto("/entrar");
  await shot(page, "10-entrar", info.project.name);
  await page.getByLabel("Seu e-mail").fill("ana@");
  await page.getByRole("button", { name: "Receber código" }).click();
  await expect(alertBox(page)).toContainText("e-mail válido");

  const address = email("limite");
  await page.getByLabel("Seu e-mail").fill(address);
  await page.getByRole("button", { name: "Receber código" }).click();
  await page.getByLabel("Código de acesso").fill("000000");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(alertBox(page)).toContainText("Código inválido");
  await expect(page.getByRole("button", { name: /Reenviar em \d+s/ })).toBeDisabled();
  await page.getByRole("button", { name: "Trocar e-mail" }).click();
  await page.getByLabel("Seu e-mail").fill(address);
  await page.getByRole("button", { name: "Receber código" }).click();
  await expect(alertBox(page)).toContainText("Muitas tentativas");
  await expect(page.getByLabel("Seu e-mail")).toHaveValue(address);

  await context.setOffline(true);
  await page.getByLabel("Seu e-mail").fill(email("offline"));
  await page.getByRole("button", { name: "Receber código" }).click();
  await expect(alertBox(page)).toContainText(/conexão|Não foi possível/);
  await context.setOffline(false);
});
