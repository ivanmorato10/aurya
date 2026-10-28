# Identidade visual AURYA · "amanhecer vivo"

## Conceito
AURYA = **aura** + **aurora**. Um dia em quatro luzes, acompanhado por um personagem.

## Personagem: Aury
Um solzinho (`src/components/Aury.tsx`) que muda com o momento:

| Momento | Aury | Cartão |
|---|---|---|
| Ao acordar | nasce no horizonte, olhos sonolentos | coral → magenta |
| Indo para o trabalho | rastros de velocidade, raios girando | azul-céu → índigo |
| Meio do dia | sol pleno, sorriso largo | amarelo → âmbar (texto violeta) |
| Antes de dormir | lua crescente com estrelas piscando | violeta → noite. **A tela Hoje inteira fica noturna.** |

Animações: flutuar, piscar, raios girando, nascer do sol, estrelas cintilando. Todas respeitam `prefers-reduced-motion`.

## Logo
- **Ícone:** squircle com o gradiente do amanhecer (#FF2E7E → #FF6A3D → #FFC23D), anéis de aura, Aury branco sorrindo e um brilho de 4 pontas. Fonte: `src/app/icon.svg` e `AppIcon` em `src/components/Logo.tsx`.
- **Nome:** "aurya" em minúsculas, Bricolage Grotesque 800, com a estrelinha em gradiente.

## Cores
| Token | Valor | Uso |
|---|---|---|
| `--bg` | #FFF6EE | fundo creme-pêssego |
| `--ink` | #2B1650 | texto, contornos, sombra 3D dos botões |
| `--ink-2` | #5D4A7A | texto secundário |
| `--magenta` | #E8336B | links, destaques |
| `--grad-sunrise` | #FF3D7F → #FF7A3D → #FFC83D | marca-texto, aba ativa, chips |

## Tipografia
- Títulos e interface: **Bricolage Grotesque**, pesada e com letras próximas.
- Afirmações: **Fraunces itálico** "soft/wonk", que dá a voz pessoal da frase.

## Componentes-assinatura
- Botão primário com gradiente magenta, sombra 3D que "afunda" ao toque e brilho que atravessa no hover.
- Secundário: branco com contorno e sombra violeta.
- Palavra-chave do título com **marca-texto do amanhecer** animado (`.hl`).
- **Aura:** anéis concêntricos que respiram em volta do Aury (`<Aura/>`).
- Explosão de brilhos quando uma nova frase aparece (`<Burst/>`).
- Barra de navegação flutuante em pílula. A aba ativa usa o gradiente.
- Player de áudio com disco em gradiente girando e ondas de som.
