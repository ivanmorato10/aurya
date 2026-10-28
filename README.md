# AURYA · um instante de presença

App web (PWA instalável) de afirmações para **quatro momentos do dia**: ao acordar, indo para o trabalho, meio do dia e antes de dormir. Cada momento mostra uma frase que permanece até o próximo horário, com um texto para **aprofundar**, leitura em voz alta e músicas instrumentais.

**Funciona sem conta.** Visitantes configuram horários, tipos de mensagem e nome, e tudo fica no aparelho. A conta é opcional (e-mail com código; Google e Apple quando habilitados). Ao criar a conta, as preferências do aparelho vão para ela.

Stack: **Next.js 16 (App Router, TypeScript)** na **Vercel** · **Supabase** (Auth por código no e-mail + Postgres com RLS) · GitHub.

## Fluxos disponíveis

| Fluxo | Onde |
|---|---|
| Abertura com paisagem, "Começar", "Como funciona" e "Já tenho conta" | `/` |
| Como funciona (tela própria) | `/como-funciona` |
| Onboarding em 3 passos: quatro horários + fuso → tipos de mensagem (prosperidade e riqueza, confiança e ação, foco e propósito, gratidão; citações de Napoleon Hill on/off) → nome opcional | `/comecar` |
| Frase do momento escolhida pelos tipos preferidos, próxima troca, prévia dos outros momentos, fonte das citações | `/hoje` |
| Aprofundar: texto, leitura em voz alta e piano opcional | `/reflexao/[id]` |
| Áudios: 3 temas, 11 afinações × 3 melodias, volume inicial 15 %, temporizador | `/audios` |
| Ajustes: horários, tipos de mensagem, nome; entrar/criar conta; sair; excluir conta | `/conta`, `/conta/*` |
| Entrar (opcional): código por e-mail; Google/Apple se configurados | `/entrar`, `/auth/confirm`, `/auth/callback` |
| Privacidade | `/privacidade` |

**Dados do visitante:** ficam só no `localStorage` do aparelho, validados ao ler. Com conta, as preferências ficam no Supabase e são espelhadas no aparelho. Ao sair, o app continua com as mesmas escolhas. Excluir a conta apaga também os dados do aparelho.

## Rodar localmente

```bash
npm install
cp .env.example .env.local   # preencha com os dados do projeto Supabase
npm run dev                  # http://localhost:3000
```

## Supabase

1. Crie um projeto (região sugerida: São Paulo).
2. Aplique a migration `supabase/migrations/20261027000000_profiles.sql` — pelo SQL Editor (colar e executar) ou com a CLI: `npx supabase link --project-ref <ref> && npx supabase db push`.
3. **Authentication → URL Configuration**
   - Site URL: `https://SEU-DOMINIO` (produção)
   - Redirect URLs: `https://SEU-DOMINIO/auth/confirm`, `https://*-SEU-TIME.vercel.app/auth/confirm` (previews) e `http://localhost:3000/auth/confirm`
4. **Authentication → Emails → Magic Link**: use o modelo em `supabase/templates/magic_link.html` (inclui o código `{{ .Token }}` e o link).
5. **Google e Apple (opcional):** habilite em Authentication → Providers, adicione `https://SEU-DOMINIO/auth/callback` nas Redirect URLs e defina `NEXT_PUBLIC_AUTH_PROVIDERS=google,apple`. Sem essa variável, os botões não aparecem.
6. **Produção**: configure SMTP próprio (Authentication → SMTP). O e-mail padrão do Supabase tem limite baixo de envios por hora e serve só para testes. Revise também *Rate Limits* e, se houver abuso, ative CAPTCHA.

### Modelo de dados e segurança
- `public.profiles`: 1 linha por conta (`id` = `auth.users.id`), nome opcional, fuso, quatro horários, `message_types` (1 a 4 tipos) e `include_quotes`. Constraints: todos ou nenhum horário, horários distintos, precisão de minuto, fuso válido, nome ≤ 60.
- RLS ativa: `select`/`update` só na própria linha. Sem `insert`/`delete` pelo cliente (perfil nasce por gatilho e morre com a conta). `anon` sem acesso. `authenticated` só altera as colunas editáveis.
- Exclusão de conta: `delete_my_account()` (security definer) apaga `auth.users` do próprio `auth.uid()`; o perfil cai em cascata. **Nenhuma chave service_role é usada pelo app.**
- O servidor valida tudo com zod e usa o id do JWT verificado (`getClaims`), nunca um id enviado pelo navegador.
- Login chamado do navegador para que os limites de taxa do Supabase considerem o IP real.
- Cabeçalhos de segurança em `next.config.ts`; redirecionamentos internos validados (`safeNextPath`).
- O catálogo de frases/reflexões/áudios é conteúdo público versionado em `content/` e `public/audio/`.

## Variáveis de ambiente

| Variável | Pública? | Uso |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | sim | URL do projeto |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (ou `..._ANON_KEY`) | sim | chave pública; acesso protegido por RLS |
| `NEXT_PUBLIC_PRIVACY_CONTROLLER`, `NEXT_PUBLIC_PRIVACY_CONTACT` | sim | identificação e contato na política de privacidade |
| `NEXT_PUBLIC_AUTH_PROVIDERS` | sim | `google,apple` quando habilitados no Supabase |

Ambientes: use **um projeto Supabase para produção e outro para desenvolvimento/preview**. Na Vercel, cadastre as variáveis separadamente para *Production* e para *Preview/Development* — assim previews nunca alteram dados reais.

## Testes

```bash
npm run typecheck && npm run lint
npm test            # unitários (vitest): horários, fusos, horário de verão, validação, catálogo, players
npm run test:db     # RLS/constraints em um Postgres temporário (precisa de initdb/pg_ctl/psql)
npm run test:e2e    # Playwright (celular + desktop) contra build de produção e um SIMULADOR local do Supabase
npm run build
```

O E2E usa `tests/e2e/mock-supabase.mjs`, um simulador que implementa só os endpoints usados pelo app. Ele nunca aponta para um projeto real. As regras reais de banco são verificadas por `npm run test:db`.

## Publicar na Vercel

1. Importe o repositório do GitHub (Framework: Next.js, raiz do repositório).
2. Cadastre as variáveis acima por ambiente.
3. Após o primeiro deploy, adicione a URL final em Supabase → Authentication → URL Configuration.

## Estrutura

```
src/app/            rotas (landing, entrar, comecar, (app)/hoje|reflexao|audios|conta, privacidade)
src/lib/            schedule (momentos + fuso), content (catálogo), validation, auth (DAL), supabase/
content/            catálogo de afirmações/reflexões e de áudios (fonte editorial)
public/audio/       33 músicas + piano das reflexões (AAC; WAVs originais estão no histórico Git)
supabase/           migration, testes de RLS, modelo de e-mail
legacy/native/      código Flutter + Swift/WidgetKit do widget de bloqueio do iPhone (não compilado)
legacy/preview/     prévia web 0.4 original e geradores de áudio
docs/pesquisa/      pesquisa editorial, de áudio e do canal de referência
```

## Pontos do briefing (docs/referencias/AURYA_Briefing_MVP_Preliminar.pdf)
- Atendidos na web: quatro momentos configuráveis, 24 afirmações e aprofundamentos, músicas existentes, uso sem conta com login opcional, português, visual azul-noite adulto.
- **Não atendíveis na web:** widgets iOS/Android (exigem app nativo; código preparado em `legacy/native/`).
- **Ainda em aberto no briefing:** monetização, formatos de widget, notificações e aprovação final do design.

## Limitações conhecidas
- **Widget da tela de bloqueio do iPhone** não existe na web. O código nativo preparado está em `legacy/native/` e exige macOS/Xcode; a tabela `profiles` já serve de backend para ele.
- A voz depende das vozes instaladas no aparelho/navegador.
- Áudio pausa ao sair da página; não toca com a tela bloqueada.
- Só português. Premium, anúncios e voz própria ficaram fora do MVP (não há telas de mentira).
- Das 24 frases, 4 são citações de Napoleon Hill com fonte; as demais são originais e aguardam revisão editorial do cliente.
