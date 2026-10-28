# AURYA · Design System (Fase 2)

Fontes: `docs/referencias/AURYA_DESIGN_REFERENCE.png` (arte aprovada) e `design/brand-kit/` (Brand Kit v1).
Vitrine para revisão (somente desenvolvimento): `npm run dev` → `/design-system`. Captura: `docs/design/design-system-vitrine.png`.

## Tokens — `src/styles/tokens.css`
Espelho Flutter (ainda não integrado): `design/tokens/aurya_tokens.dart`.

| Grupo | Tokens |
|---|---|
| Paleta | `--aurya-midnight` #101C2C · `--aurya-ocean` #1E3A5F · `--aurya-champagne` #C5B69A · `--aurya-ivory` #F4F0E8 |
| Derivadas | transparências de Ivory (80/64/48/12/8/5 %), Champagne claro/escuro, gradiente champagne, véu de legibilidade (`--aurya-scrim`), erro #E8A39A |
| Semânticos | `--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-border`, `--color-text`, `--color-text-muted`, `--color-accent` |
| Tipografia | Cormorant Garamond (editorial) e Inter (interface), via `next/font` (OFL) |
| Escala | Display 40 · Headline 32 · Title 22 (Cormorant) · Body 16 · Label 15 · Caption 13 · Overline 11 (+0,22em) · Button 16 · Nav 11 (Inter) |
| Espaço | 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 · 48; margem lateral 24 |
| Forma | cápsula 999, card 20, campo 14; área de toque 48; navegação 64 |

Contraste (WCAG): Ivory sobre Midnight 15,8:1 · Champagne sobre Midnight 8,6:1 · Ivory 64 % sobre Midnight ≈ 7,4:1 · Midnight sobre Ivory 15,8:1 · Ivory sobre Ocean 10,4:1.

## Marca — `src/components/brand/Logo.tsx`
- `SunSymbol`: versão corrigida do símbolo do Brand Kit, com arco duplo, 13 raios alternando longos e curtos, horizonte em dois segmentos, traço fino em champagne. O SVG fica em `design/brand-kit/logos/sun-symbol-corrigido.svg`.
- `Wordmark`: "AURYA" em Cormorant Garamond 500, espaçamento 0,16em, gradiente champagne.
- `Logo`: símbolo, nome e "Afirmações para uma vida extraordinária".
- Comparação com a referência: `docs/design/logo-comparacao.png`. **Aguardando aprovação.** O ícone do app e o logo das telas atuais ainda não foram substituídos.

## Componentes
| Componente | Arquivo | Notas |
|---|---|---|
| Botões (primário, secundário, texto) | `ui/Button.tsx` + `.btn-*` | Primário: cápsula Ivory com texto Midnight. Secundário: Ocean com texto Ivory. Texto: sublinhado discreto. Estado `loading` bloqueia cliques repetidos |
| Cabeçalho | `ui/AppHeader.tsx` | Voltar, título ou marca, ação. Sem menu hambúrguer |
| Navegação inferior | `TabBar.tsx` | Início, Áudio, Perfil; item ativo em champagne |
| Campo de formulário | `ui/TextField.tsx` | Rótulo, dica e erro ligados por `aria-describedby` |
| Seletor de horário | `ui/TimeRow.tsx` | Ícone fino do momento, nome e hora |
| Card editorial | `ui/EditorialCard.tsx` | Sem sombra; borda superior sutil |
| Controles de áudio | `ui/AudioControls.tsx` | `PlayButton` (círculo Ivory) e `ProgressBar` (tempo decorrido/total do temporizador existente) |
| Estados | `ui/StateMessage.tsx` | Carregando (skeleton), vazio, erro com "Tentar novamente" |
| Fundo atmosférico | `ui/Atmosphere.tsx` | Usa a foto aprovada quando existir; até lá, a ilustração provisória |
| Ícones dos momentos | `Icons.tsx` (`MomentIcon`) | Traço 1,5: amanhecer, manhã, sol pleno, lua |

## Imagens
Status e especificações em `docs/IMAGENS.md`; registro de arquivos em `src/lib/images.ts`.
