# Imagens AURYA — status

**Disponível:** apenas a prancha de direção artística `docs/referencias/Cinematic Wellness Landscape Styleguide.png`
(1536 × 1024, com legendas e divisórias). Cada painel tem cerca de 380 × 535 px, abaixo do necessário,
e contém texto. **Não é usada como asset de produção** e não foi recortada.

**Enquanto pendentes**, cada tela usa a ilustração vetorial provisória na paleta da marca (`src/components/Scene.tsx`).

## Especificação comum
- Vertical 9:19,5, mínimo **1242 × 2688 px** (ideal 1290 × 2796), JPEG/PNG de alta qualidade; o app converte para WebP/AVIF.
- Sem texto, logotipo, marca d'água ou moldura.
- Espaço negativo no **terço superior e central** (onde fica a afirmação); horizonte entre 55 % e 70 % da altura.
- Tons azulados e luz delicada (champagne/âmbar suave), coerentes com Midnight Navy e Ocean Blue.
- Origem própria/gerada com direitos de uso para o projeto.

## Arquivos

| # | Arquivo | Uso | Painel da prancha | Status |
|---|---|---|---|---|
| 1 | `public/images/opening.webp` | Abertura | 01 Abertura | pendente (arquivo individual) |
| 2 | `public/images/moments/wake.webp` | Início · Ao acordar | 02 Manhã | pendente |
| 3 | `public/images/moments/commute.webp` | Início · Indo para o trabalho | — (ver decisão abaixo) | **pendente: sem imagem correspondente** |
| 4 | `public/images/moments/midday.webp` | Início · Meio do dia | 03 Meio do dia | pendente |
| 5 | `public/images/moments/sleep.webp` | Início · Antes de dormir | 05 Noite | pendente |
| 6 | `public/images/player.webp` | Player de áudio | 06 Player | pendente |
| 7 | `public/images/reflection.webp` | Aprofundamento | 07 Aprofundamento | pendente |
| — | (painel 04 Fim de tarde) | sem momento correspondente | 04 Fim de tarde | a decidir |

## Decisão pendente: "Indo para o trabalho"
A prancha segue os momentos do mockup (Manhã, Meio do dia, Fim de tarde, Noite). Os momentos aprovados são
Ao acordar, Indo para o trabalho, Meio do dia e Antes de dormir. Opções:
1. Gerar uma imagem nova para "Indo para o trabalho" (manhã clara: litoral ou estrada costeira com luz da manhã, sem pessoas).
2. Usar o painel 04 "Fim de tarde" para esse momento (luz quente pode não combinar com início do dia).
