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

## Arquivos (integrados como PROVISÓRIOS)

Origem: `docs/design/AURYA_Images.zip` (recortes individuais da prancha, sem legendas). Originais preservados em
`design/images-originais/`. Convertidos para WebP (qualidade 86) **sem upscale**; total ≈ 300 KB.
**Não estão prontos para produção:** a resolução (~250–340 px de largura) fica abaixo do necessário para telas de alta densidade.

| Arquivo | Tela | Origem | Tamanho |
|---|---|---|---|
| `public/images/opening.webp` | Abertura | abertura.png | 246 × 776 |
| `public/images/moments/wake.webp` | Início · Ao acordar | manha.png | 259 × 776 |
| `public/images/moments/commute.webp` | Início · Indo para o trabalho | fim-de-tarde.png | 253 × 776 |
| `public/images/moments/midday.webp` | Início · Meio do dia | meio-dia.png | 251 × 776 |
| `public/images/moments/sleep.webp` | Início · Antes de dormir | noite.png | 341 × 749 |
| `public/images/player.webp` | Player de áudio | player-audio.png | 329 × 755 |
| `public/images/reflection.webp` | Aprofundamento | aprofundamento.png | 340 × 755 |

**Próximo passo:** exportar as mesmas sete imagens em 1242 × 2688 px ou mais e substituir os arquivos, mantendo os nomes.
**Decisão aplicada (reversível):** "Indo para o trabalho" usa a imagem "Fim de tarde". O ideal é gerar uma imagem de manhã clara.
