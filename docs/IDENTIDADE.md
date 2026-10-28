# Identidade visual AURYA · "noite azul"

O briefing do MVP pede: **azul profundo, atmosfera noturna e estética adulta**. Referência de tom: apps de bem-estar como o Calm (`docs/referencias/`). A paleta abaixo é uma proposta; o briefing ainda pede aprovação de logo, HEX, tipografia e telas-chave.

## Logo
- **Assinatura:** "aurya" em Instrument Serif, com um pequeno sol nascendo sobre o "a" final (`Wordmark` em `src/components/Logo.tsx`).
- **Ícone do app:** squircle com céu do amanhecer (azul-noite → lavanda → rosado), sol creme no horizonte e reflexos no lago (`src/app/icon.svg`).

## Imagem: paisagens por momento
Ilustrações vetoriais próprias (`src/components/Scene.tsx`), com céu, montanhas, pinheiros e lago com reflexo:

| Momento | Céu |
|---|---|
| Ao acordar | amanhecer: azul-noite → lavanda → pêssego, sol no horizonte |
| Indo para o trabalho | manhã clara azul, sol subindo |
| Meio do dia | azul intenso, sol alto |
| Antes de dormir | noite com lua crescente e estrelas cintilando |

## Cores
| Token | HEX | Uso |
|---|---|---|
| `--bg` | #0B1026 | fundo azul-noite |
| `--surface` | #151D3B | cartões e listas |
| `--surface-2` | #1C2550 | ícones e destaques de lista |
| `--ink` | #F5F7FF | texto |
| `--accent` | #5B8CFF | ação principal, seleção, progresso |
| `--dawn` | #FFD6A6 | detalhe de luz (sol, ícone ativo) |
| `--danger` | #FF7A7A | erros e exclusão |

## Tipografia
- Interface: **Plus Jakarta Sans** (500–600), títulos de 26–34px sem exagero de peso.
- Afirmações e assinatura: **Instrument Serif**.

## Componentes
- Botão principal em pílula azul. Na tela de abertura, pílula branca sobre a paisagem. Secundário em vidro translúcido.
- Listas no estilo de ajustes do iPhone, com miniatura da paisagem de cada momento.
- Barra de progresso fina com ponto luminoso (onboarding).
- Barra de abas inferior com três itens: Hoje, Áudios e Ajustes.
- Player da reflexão fixo na parte de baixo, como um mini-player.
- Movimento discreto: estrelas cintilando, reflexo no lago, transições suaves. Tudo respeita `prefers-reduced-motion`.
