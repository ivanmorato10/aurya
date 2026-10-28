import { expect, test, type Page } from "@playwright/test";

const MOCK = "http://127.0.0.1:54399";
const control = (page: Page, body: object) => page.request.post(`${MOCK}/__control`, { data: body });
const email = (tag: string) => `${tag}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
const alertBox = (page: Page) => page.locator("p[role=alert]");
const DAY = 'ul[aria-label="Momentos do dia"]';
// Aguarda as animações de entrada antes da captura.
const shot = async (page: Page, name: string, project: string) => {
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `test-results/screens/${project}-${name}.png` });
};

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
  await expect(page.getByText("A prosperidade também é um estado de presença.")).toBeVisible();
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
  await expect(page.locator(".home-affirmation")).not.toBeEmpty();
  await expect(page.locator(".moment-line")).toBeVisible();
  await expect(page.locator(DAY + " .media-row")).toHaveCount(4);
  await noHorizontalScroll(page);
  await shot(page, "5-hoje", info.project.name);
  for (const btn of await page.locator(DAY + " .media-main").all()) {
    await btn.click();
    await expect(page.locator(".home-source")).toHaveCount(0);
  }

  // Preferências sobrevivem ao recarregar; "/" leva direto para Hoje
  await page.reload();
  await expect(page.locator(DAY).filter({ hasText: "23:00" })).toBeVisible();
  await page.goto("/");
  await expect(page).toHaveURL(/\/hoje/);

  // Aprofundar sem conta
  await page.locator(DAY + " .media-row:has(.badge) .media-main").click();
  const phrase = await page.locator(".home-affirmation").innerText();
  await page.getByRole("link", { name: "Aprofundar", exact: true }).click();
  await expect(page.locator(".reflection-affirmation")).toHaveText(phrase);
  await expect(page.getByRole("button", { name: "Ouvir" })).toBeEnabled();
  await noHorizontalScroll(page);
  await shot(page, "6-reflexao", info.project.name);
});

test("visitante: ajustes salvam no aparelho", async ({ page }, info) => {
  await page.goto("/comecar");
  await onboard(page);
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Perfil" }).click();
  await expect(page.getByText("Você está usando sem cadastro")).toBeVisible();
  await noHorizontalScroll(page);
  await shot(page, "7-ajustes-visitante", info.project.name);

  await page.getByRole("link", { name: /horários/i }).click();
  await page.getByLabel("Meio do dia").fill("12:10");
  await page.getByRole("button", { name: "Salvar horários" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Alterações salvas." })).toBeVisible();

  await page.goto("/conta/mensagens");
  await page.getByRole("checkbox", { name: /Confiança e ação/ }).uncheck();
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Alterações salvas." })).toBeVisible();
  await shot(page, "8-tipos", info.project.name);
  await page.reload();
  await expect(page.getByRole("checkbox", { name: /Confiança e ação/ })).not.toBeChecked();

  await page.goto("/hoje");
  await expect(page.locator(DAY)).toContainText("12:10");
});

test("criar conta leva as preferências do aparelho; falha ao salvar preserva; sair mantém o app", async ({ page }) => {
  await page.goto("/comecar");
  await onboard(page, { name: "Bia" });
  await page.getByRole("navigation", { name: "Navegação principal" }).getByRole("link", { name: "Perfil" }).click();
  await page.getByRole("link", { name: "Entrar ou criar conta" }).click();
  const address = email("conta");
  await login(page, address);
  await expect(page).toHaveURL(/\/conta$/);
  await expect(page.getByText(address)).toBeVisible();

  // Migração: a conta nova recebeu as preferências do aparelho
  await page.goto("/conta");
  await expect(page.getByText("Bia", { exact: true })).toBeVisible();

  // Com conta: falha de gravação preserva o formulário; depois salva
  await page.goto("/conta/horarios");
  await page.getByLabel("Meio do dia").fill("12:20");
  await control(page, { failWrites: true });
  await page.getByRole("button", { name: "Salvar horários" }).click();
  await expect(alertBox(page).filter({ hasText: "Não foi possível salvar" })).toBeVisible();
  await expect(page.getByLabel("Meio do dia")).toHaveValue("12:20");
  await control(page, { failWrites: false });
  await page.getByRole("button", { name: "Salvar horários" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Alterações salvas." })).toBeVisible();

  // Sair: continua usando com as mesmas preferências neste aparelho
  await page.goto("/conta");
  await page.getByRole("button", { name: "Sair" }).click();
  await expect(page.getByText("Você está usando sem cadastro")).toBeVisible();
  await page.goto("/hoje");
  await expect(page.locator(DAY)).toContainText("12:20");
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
  await expect(page.locator(".reading-text")).toBeVisible();
});

test("áudios: biblioteca, player em tela cheia e folha de configurações", async ({ page }, info) => {
  await page.goto("/audios");
  await expect(page.getByRole("heading", { name: "Áudios" })).toBeVisible();
  await expect(page.locator('ul[aria-label="Biblioteca de áudios"] .media-row')).toHaveCount(11);
  await noHorizontalScroll(page);
  await shot(page, "9-audios", info.project.name);

  await page.getByRole("tab", { name: "Gratidão" }).click();
  await expect(page.locator('ul[aria-label="Biblioteca de áudios"] .media-row')).toHaveCount(4);
  const res = await page.request.get("/audio/music-v3-432-1.m4a");
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("audio");

  // Abrir o player tocando na linha
  await page.locator('ul[aria-label="Biblioteca de áudios"] .media-main').filter({ hasText: "432 Hz" }).click();
  const player = page.getByRole("dialog", { name: /Player/ });
  await expect(player).toBeVisible();
  await expect(player.getByRole("heading", { name: "Aurora" })).toBeVisible();
  await expect(player.getByText("Gratidão")).toBeVisible();
  await shot(page, "12-player", info.project.name);

  await player.getByRole("button", { name: "Reproduzir" }).click();
  await expect(player.getByRole("button", { name: /Pausar|Reproduzir/ }).first()).toBeVisible();

  // Folha de configurações
  await player.getByRole("button", { name: "Configurações", exact: true }).click();
  const sheet = page.getByRole("dialog", { name: "Configurações" });
  await expect(sheet).toBeVisible();
  await sheet.getByRole("radio", { name: "1 min" }).click();
  await sheet.getByRole("radio", { name: "Horizonte" }).click();
  await expect(sheet.getByRole("slider", { name: /Volume 15%/ })).toBeVisible();
  await shot(page, "13-configuracoes", info.project.name);
  await sheet.getByRole("button", { name: "Salvar configurações" }).click();
  await expect(sheet).toHaveCount(0);
  await expect(player.getByRole("heading", { name: "Horizonte" })).toBeVisible();
  await expect(player.locator(".progress-times")).toContainText("01:00");

  await player.getByRole("button", { name: "Próxima frequência" }).click();
  await expect(player.getByText(/639 Hz/)).toBeVisible();
  await player.getByRole("button", { name: "Fechar player" }).click();
  await expect(player).toHaveCount(0);
});

test("afirmações: biblioteca por momento abre o aprofundamento", async ({ page }, info) => {
  await page.goto("/afirmacoes");
  const list = page.locator('ul[aria-label="Afirmações"] .media-row');
  await expect(list).toHaveCount(24);
  await page.getByRole("tab", { name: "Antes de dormir" }).click();
  await expect(list).toHaveCount(6);
  await noHorizontalScroll(page);
  await shot(page, "14-afirmacoes", info.project.name);
  const text = await list.first().locator(".media-title").innerText();
  await list.first().locator(".media-main").click();
  await expect(page.locator(".reflection-affirmation")).toHaveText(text);
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

test("início: tocar na afirmação abre o aprofundamento; play usa a voz do aparelho", async ({ page }, info) => {
  await page.goto("/comecar");
  await onboard(page);
  await expect(page.getByRole("button", { name: "Ouvir a afirmação" })).toBeEnabled();
  await noHorizontalScroll(page);
  await shot(page, "11-inicio", info.project.name);
  // Sem voz no navegador de teste: o app informa, sem fingir reprodução
  await page.getByRole("button", { name: "Ouvir a afirmação" }).click();
  await expect(page.locator(".now-actions .play-status")).toContainText(/voz|Voz|leitura|Leitura/);
  const phrase = await page.locator(".home-affirmation").innerText();
  await page.locator(".home-affirmation-link").click();
  await expect(page).toHaveURL(/\/reflexao\//);
  await expect(page.locator(".reflection-affirmation")).toHaveText(phrase);
});
