# AURYA · Design System — linguagem "Serenidade"

**Fonte principal da verdade:** `docs/referencias/AURYA_Serenidade_em_Audio.png`. Cores medidas na própria imagem.
Marca e logo: `design/brand-kit` (símbolo solar corrigido, aprovado). Tokens: `src/styles/tokens.css`. Espelho Flutter: `design/tokens/aurya_tokens.dart`.
Comparações e capturas: `docs/design/serenidade/`.

## Princípios aplicados a todas as telas
- **Fotografia em sangria total** no topo (ou tela inteira), com gradação escura e dessaturada e um leve desfoque, como a profundidade de campo da referência. Esmaece para o fundo `#05101A`, sem molduras nem cards.
- **"AURYA" espaçado à esquerda e ícone de sol à direita**, sobre a foto.
- **Título serifado à esquerda** (Cormorant Garamond 40) com subtítulo leve (Inter 300).
- **Abas de texto** com sublinhado champagne.
- **Listas com miniatura arredondada** (96×70, raio 8), título, detalhes e **anel fino de play**, separadas por divisores de 1 px.
- **Player em tela cheia:** sobretítulo do tema, título serifado, progresso champagne com marcador e **anel champagne de 84 px**.
- **Folha inferior de configurações:** chips em pílula (o ativo é champagne preenchido), melodias como blocos de imagem, volume com marcador e botão champagne "Salvar configurações".
- **Navegação inferior com 4 itens:** Início, Áudios, Afirmações e Perfil. Ícones lineares; o ativo fica em champagne.

## Tokens principais
| Token | Valor | Uso |
|---|---|---|
| `--aurya-night` | #05101A | fundo |
| `--aurya-night-2` | #0A1620 | folhas |
| `--aurya-glow` | #E6C49A | ação, seleção, progresso (medido na referência) |
| `--aurya-on-glow` | #0B1118 | texto sobre champagne |
| `--aurya-text` | #E8E6E1 | texto |
| `--aurya-text-2` | 66 % | texto secundário (≥ 7:1) |
| `--aurya-line` | 9 % | divisores |
| `--aurya-photo-grade` | brilho .8 · saturação .88 · desfoque .5px | gradação única das fotos |

Tipografia: Display 40, Headline 34 e Title 26 em Cormorant; Body 15/300, Label 15, Section 17, Meta 13/300, Overline 12 (+0,32em), Button 16 e Nav 12 em Inter.

## Componentes (`src/components/ui/`)
`Hero` · `TopBar` (`BrandBar`, `CloseBar`) · `Tabs` · `MediaRow` · `AudioControls` (`RingButton`, `ProgressBar`) · `Chip` (`ChipGroup`) · `Sheet` (`Sheet`, `SheetSection`) · `Button` · `TextField` · `TimeRow` · `StateMessage` · `TabBar`.

## Conteúdo real no lugar dos exemplos da referência
| Referência | AURYA |
|---|---|
| "Abundância Natural · 432 Hz · 20 min" | linha = tema × frequência real ("Frequência 432 Hz · Gratidão · 3 melodias"); no player, o título é a melodia (Aurora, Horizonte, Acolhimento) |
| 20:00, 10/20/30 min, "Sem limite" | temporizador real: 1, 5, 10 e 15 min |
| Melodias Oceano, Floresta, Ambiente, Piano | as 3 composições reais |
| Coração (favoritar), ±15 s | não existem no app; omitidos |
| Anterior/Próxima | navegam entre as frequências do tema |

## Imagens
Integradas, mas **provisórias** (baixa resolução): ver `docs/IMAGENS.md`.
