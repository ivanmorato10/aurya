# Áudios: pesquisa, associações e escolhas editoriais

Pesquisa exploratória em 23/10/2026. Não é revisão sistemática própria nem um inventário de “todas as frequências positivas”. Hz mede oscilações por segundo; o significado atribuído a cada número não constitui um efeito demonstrado. O AURYA usa **prosperidade, riqueza e gratidão como temas de intenção**, coerentes com suas afirmações. O enquadramento Free/Premium fica **a definir**.

## Famílias pesquisadas

| Família / frequência | Associação popular encontrada — não efeito comprovado | Tratamento nesta entrega |
|---|---|---|
| Solfeggio 174 Hz | Aterramento, conforto, alívio | Amostra de tom puro, organizada por intenção |
| 285 Hz | Restauração física e integridade corporal | Sem alegação de reparação de tecidos |
| 396 Hz | Medo, culpa e liberação | Sem promessa de mudança emocional específica |
| 417 Hz | Renovação e mudanças | Tema simbólico, não efeito do Hz |
| 528 Hz | Amor, transformação, “milagres” e, em alguns anúncios, DNA | Tom puro; nenhuma alegação de cura ou reparo de DNA |
| 639 Hz | Relações e harmonia | Organização editorial, não resultado garantido |
| 741 Hz | Expressão e “limpeza/detox” | Nenhuma promessa de desintoxicação |
| 852 Hz | Intuição e clareza | Tema popular, não mecanismo validado |
| 963 Hz | Espiritualidade e consciência ampliada | Sem efeito espiritual apresentado como fato |
| 432 Hz | Afinação alternativa descrita como calma/natural | Aqui é **um tom puro de 432 Hz**, não uma música inteira reafinada |
| 888 Hz | Abundância, riqueza e prosperidade em catálogos comerciais | Tema de intenção; nenhuma relação causal com renda |
| Binaurais | Diferença entre tons apresentados separadamente a cada ouvido | Pesquisados, **não incluídos no player atual** |
| Paisagens sonoras | Natureza, água, pássaros, ambientes de descanso | Pesquisadas como alternativa futura; não simuladas por estes tons |

As associações da família Solfeggio/432 foram consultadas em um [catálogo que promove e descreve esses tons](https://www.solfeggiofrequencies.org/the-frequencies/). É fonte primária sobre **o que esse setor publica**, não evidência científica. O uso comercial de 888 Hz/abundância está diretamente documentado no [catálogo 888 Hz do Insight Timer](https://insighttimer.com/meditation-topics/888hz). Não foram usados os áudios dessas plataformas nem suas alegações como comprovação.

## O que a evidência permite dizer

**Binaurais e entrainment.** A revisão de Ingendoh, Posny e Heine (2023) reuniu 14 estudos: cinco compatíveis com a hipótese de entrainment, oito contraditórios e um misto. A heterogeneidade limita conclusões; não se deve tratar sincronização cerebral como resultado garantido. O fenômeno binaural exige entrega separada de dois tons aos ouvidos: por exemplo, 400 Hz à esquerda e 410 Hz à direita dão uma diferença de 10 Hz. Essas grandezas são distintas; um arquivo mono de 888 Hz não é um binaural de 8 Hz. [Artigo integral em PLOS ONE](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0286023), [registro PubMed 37205669](https://pubmed.ncbi.nlm.nih.gov/37205669/).

**Estímulos auditivos, ativação e cognição.** Chee e colaboradores (2024) revisaram 31 estudos envolvendo música, ruído e binaurais. Encontraram resultados mistos ou insuficientes nas relações entre medidas autonômicas e desempenho cognitivo. Isso não determina um Hz universal para foco, gratidão ou riqueza. [PubMed 38458383](https://pubmed.ncbi.nlm.nih.gov/38458383/).

**528 Hz: estudo pequeno e intervenção diferente.** Akimoto e colaboradores (2018) avaliaram nove adultos saudáveis em duas condições de música de piano, durante cinco minutos. A condição chamada “528 Hz” era uma música com afinação de referência em 444 Hz, incluindo uma nota próxima de 528 Hz; não era simplesmente um seno de 528 Hz. Há resultados exploratórios em medidas de estresse, mas amostra pequena e comparação de significância dentro de condições não estabelecem superioridade ampla ou eficácia de nossos arquivos. Não estudou riqueza, gratidão ou reparo de DNA. [Estudo primário completo](https://content.scirp.org/pdf/health_2018090514214117.pdf).

**432 Hz: afinação não equivale a tom único.** Um piloto cruzado com 33 voluntários comparou a mesma música afinada em 432/440 Hz e relatou diferenças em algumas medidas e percepções. Os autores indicaram necessidade de estudos maiores. Há um corrigendum associado. Isso não valida nosso tom mono como reprodução do estudo ou terapia. [Estudo primário](https://pubmed.ncbi.nlm.nih.gov/31031095/), [corrigendum](https://pubmed.ncbi.nlm.nih.gov/32113613/).

**Paisagens sonoras.** Uma síntese de literatura encontrou resultados favoráveis para alguns desfechos de exposição a sons naturais em contextos estudados. Não demonstra benefícios de qualquer frequência isolada, nem significa que tons sintéticos reproduzam água ou pássaros. [Síntese publicada em PNAS](https://pubmed.ncbi.nlm.nih.gov/33753555/).

As páginas PubMed que retornaram conteúdo incompleto na abertura foram consultadas também por seus registros indexados; a revisão binaural foi lida no periódico original. Não foram realizadas medições em usuários, ensaios clínicos ou testes de audição neste projeto.

## O que foi produzido

- **11 amostras originais**, cobrindo os nove números Solfeggio listados, 432 e 888 Hz. Arquivos PCM WAV mono, 24.000 amostras/s, 16 bits, 12 segundos cada. Não há voz, música comercial, material do Instagram/YouTube ou gravação baixada de terceiros.
- Cada arquivo contém um seno na frequência indicada, com envelope suave de 0,4 s em cada borda. Em repetição, a amplitude diminui e retorna a cada ciclo; não é uma composição musical contínua.
- Pico digital de aproximadamente 0,12 da escala máxima. Player começa em 15% do volume. Isso reduz o nível digital inicial, mas não calibra a pressão sonora dos alto-falantes/fones da pessoa.
- Frequências, duração, canais, amplitude e bordas verificadas diretamente nos arquivos; frequências medidas por FFT em uma região sem fades. Onze arquivos também foram decodificados no navegador.
- Origem explícita no catálogo: síntese local para o projeto, reproduzível com `tools/generate_audio.py`. Nenhuma licença de música de terceiro é necessária para essas amostras geradas; não há declaração de exclusividade sobre uma onda senoidal.
- Associação de arquivo a tema é **escolha editorial do AURYA**, não correspondência clínica ou efeito atribuído ao número. Os temas podem mudar sem alterar os arquivos. Não há freemium, preço, entitlement ou anúncio definido para áudios.

## Próximos testes para iPhone

Validar compilação Flutter/plugin, decodificação dos WAV, início/pausa/loop, temporizador, volume, rota de áudio, desconexão de fones, interrupções e lifecycle em aparelho. A implementação atual pausa ao sair da área/do app; **reprodução com tela bloqueada e em segundo plano não está habilitada nem validada**. Se esse comportamento for desejado, exigirá configuração e testes de sessão de áudio iOS, política de interrupções, controles do sistema e execução de temporizador sob suspensão. O widget de afirmações permanece silencioso e independente do player.
