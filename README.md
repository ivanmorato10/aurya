# AURYA · um instante de presença

App web (PWA instalável) de afirmações para **quatro momentos do dia** — ao acordar, indo para o trabalho, meio do dia e antes de dormir. Cada momento mostra uma frase que permanece até o próximo horário, com um texto para **aprofundar**, leitura em voz alta e músicas instrumentais.

Stack: **Next.js 16 (App Router, TypeScript)** na **Vercel** · **Supabase** (Auth por código no e-mail + Postgres com RLS) · GitHub.

## Fluxos disponíveis

| Fluxo | Onde |
|---|---|
| Entrar/criar conta com código de 6 dígitos por e-mail (sem senha; o e-mail também traz link direto) | `/entrar`, `/auth/confirm` |
| Definir os quatro horários e o fuso (detectado no aparelho) | `/comecar` |
| Frase do momento atual, próxima troca, prévia dos outros momentos, fonte das citações | `/hoje` |
| Aprofundar: texto, leitura em voz alta (voz do aparelho) e piano de fundo opcional | `/reflexao/[id]` |
| Áudios: 3 temas, 11 afinações × 3 melodias, volume inicial 15 %, temporizador | `/audios` |
| Alterar horários/nome/fuso, sair, **excluir conta** | `/conta` |
| Política de privacidade (fatos do que o app guarda) | `/privacidade` |

Recuperação de acesso: como não há senha, entrar de novo com o e-mail **é** a recuperação.

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
5. **Produção**: configure SMTP próprio (Authentication → SMTP). O e-mail padrão do Supabase tem limite baixo de envios por hora e serve só para testes. Revise também *Rate Limits* e, se houver abuso, ative CAPTCHA.

### Modelo de dados e segurança
- `public.profiles`: 1 linha por conta (`id` = `auth.users.id`), nome opcional, fuso, quatro horários. Constraints: todos ou nenhum horário, horários distintos, precisão de minuto, fuso válido, nome ≤ 60.
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

## Limitações conhecidas
- **Widget da tela de bloqueio do iPhone** não existe na web. O código nativo preparado está em `legacy/native/` e exige macOS/Xcode; a tabela `profiles` já serve de backend para ele.
- A voz depende das vozes instaladas no aparelho/navegador.
- Áudio pausa ao sair da página; não toca com a tela bloqueada.
- Só português. Premium, anúncios e voz própria ficaram fora do MVP (não há telas de mentira).
- Das 24 frases, 4 são citações de Napoleon Hill com fonte; as demais são originais e aguardam revisão editorial do cliente.
