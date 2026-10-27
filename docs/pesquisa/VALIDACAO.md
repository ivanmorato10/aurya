# Validação AURYA 0.4

Executada em 23/10/2026, Windows, Node.js do runtime local e Edge headless. A entrega anterior de dois períodos foi substituída por quatro momentos e revisão centrada no widget de bloqueio do iPhone.

## Verificações executadas

- **11 testes de modelo passaram**, zero falhas, com `TZ=America/Los_Angeles`.
- `node --check preview/app.mjs`: sintaxe válida.
- Teste de fluxo em Edge passou: cadastro obrigatório/e-mail inválido, oito idiomas e aviso de japonês pendente, quatro horários e rejeição de duplicados, navegação, quatro afirmações, privacidade simulada, exportação JSON sem e-mail/nome, edição, Premium futuro, exclusão, erro de catálogo e retry.
- Relógio virtual do navegador: a frase ficou igual após atravessar meia-noite e mudou ao passar o próximo horário. Não há loop de atualização de poucos segundos.
- Layout da revisão verificado em 320, 390, 768 e 1440 px, sem transbordamento horizontal. Mock retangular sem transbordamento vertical nos quatro tamanhos. Capturas atualizadas de quatro horários e bloqueio inspecionadas visualmente.
- Modelo: fronteiras exatas, horários de rotina noturna, data da ocorrência anterior, quatro entradas por dia sem entrada extra à meia-noite, DST em março/novembro de Los Angeles, seleção determinística, oito idiomas, catálogo curto em primeira pessoa e contrato exportado.
- Catálogo atual: 24 afirmações, seis por momento, com as seis frases solicitadas e amostras originais coerentes. Nenhuma tradução revisada adicional é alegada.
- Fragmentos XML/plist lidos com parser e fixture JSON gerada pelo mesmo contrato da prévia; ambos válidos. Isso não verifica entitlements assinados ou compilação Swift.

## Reprodução

Na pasta `aurya`, com Node disponível:

```powershell
$env:TZ='America/Los_Angeles'
node --test preview/model.test.mjs
node --check preview/app.mjs
```

Com Playwright disponível, Edge instalado e o servidor da prévia na porta 8765: `node preview/browser.test.cjs`. O teste usa o pacote Playwright do runtime do Codex neste computador, via NODE_PATH, e Edge já instalado; não instalou pacotes ou navegadores. As capturas são salvas na pasta `aurya`.

## Matriz de implementação e evidência

| Área | Implementado | Verificado neste ambiente |
|---|---|---|
| Cadastro demo obrigatório | Web e Flutter | Fluxo web; Flutter não executado |
| Quatro horários configuráveis, valores de exemplo | Web e Flutter | Web/modelo, inclusive horários noturnos |
| Mensagem fixa até a próxima troca | JS, Dart e motor Swift | JS/browser, inclusive meia-noite; Dart/Swift não executados |
| Afirmações curtas e catálogo separado | JSON compartilhado | Testes de conteúdo e inspeção |
| Simulação de bloqueio | Web e Flutter, explicitamente rotulada | Web, quatro larguras e privacidade simulada |
| Widget real de bloqueio | Fontes Swift/WidgetKit e contrato preparados | Somente revisão do código; não compilado/instalado |
| App Group e MethodChannel | Implementação e fragmentos preparados | Exportação JSON web; ponte nativa não executada |
| Timeline futura, sem rotação contínua | Provider Swift e motor de ocorrência | Modelo JS; comportamento WidgetKit pendente |
| Privacidade de bloqueio | Opt-in no Flutter, `.privacySensitive`, minimização | Toggle e JSON no navegador; iOS pendente |
| Auth/backend/anúncios/compras/voz | Identificados como futuros | Não integrados nem ativados |

## Ainda não verificado

Flutter/Dart/Swift/Xcode ausentes. **Nenhuma compilação, análise estática ou teste Flutter/XCTest executado. Nenhum widget instalado em iPhone.** Os testes de navegador não comprovam execução do código Swift/Dart. A integração no target Xcode, App Group e assinatura ainda precisa ser realizada no Mac conforme `IOS_WIDGET.md`.

Não foram testados em aparelho: pontualidade de trocas WidgetKit, renovação da timeline, processo fechado, Always On, Face ID, bateria/Focus, viagem de fuso, mudança de relógio, redaction, Dynamic Type, remoção de conteúdo já renderizado ou integração real com conta. O roteiro concreto está em `IOS_WIDGET.md`.

Não houve substituição por notificações/Live Activity, publicação, cobrança, contratação ou uso de microfone. Os horários numéricos iniciais continuam sendo somente exemplos editáveis. A documentação Apple sustenta a preparação técnica, não uma garantia de funcionamento ou entrega pontual.

## Atualização editorial — Napoleon Hill

Catálogo ampliado para 24 afirmações originais, seis por momento. Acrescentados propósito, confiança com ação, iniciativa, autodisciplina, atenção, planejamento e persistência. Mantidas as frases de prosperidade/abundância solicitadas, sem promessas de resultado. Referências da Fundação no README e metadados do catálogo; novas frases não atribuídas a Hill ou apresentadas como endosso. Conteúdo indexado das duas páginas oficiais consultado; acesso direto retornou 403.

Fixture JSON do widget regenerada a partir do catálogo, exemplo de galeria Swift e amostras de teste nativas alinhados. Novo teste verifica princípios editoriais, frases solicitadas e igualdade entre exportação e fixture nativa. Os testes do modelo e o fluxo de navegador foram executados novamente. Design, quatro horários e arquitetura preservados. A compilação Flutter/Swift e o teste em iPhone continuam pendentes pelo mesmo limite do ambiente Windows.

## Nova área de áudios e reforço editorial

- 24 afirmações no catálogo, seis por momento; preservadas as frases anteriores e incluídas dignidade para prosperar, reconhecimento da abundância e construção de riqueza com propósito. Os 11 testes de conteúdo/horários continuam passando.
- **6 testes de sessão de áudio passaram**, cobrindo ausência de autoplay, volume inicial, pausa/retomada com tempo restante, conclusão do timer, troca silenciosa, encerramento, volume limitado, erro e cancelamento durante preparação. **Total: 17 testes Node, zero falhas.**
- `tools/verify_audio.py`: 11 arquivos PCM inspecionados. Mono, 24 kHz, 16 bits, 12 s, pico ~0,12, bordas em zero e frequência real medida por FFT igual ao rótulo.
- Novo teste de navegador `preview/audio.browser.test.cjs` passou em Edge: play/pause real via HTMLAudioElement, avanço de currentTime, loop e duração de 12 s, volume inicial 15% e alteração, temas/faixas, troca sem autoplay, pausa ao navegar, widget silencioso, erro HTTP e recuperação, temporizador com relógio virtual, quatro larguras e decodificação dos 11 WAVs.
- Teste de fluxo anterior também passou novamente, preservando cadastro, quatro momentos, idioma e virada de dia. Captura `preview-audios.png` inspecionada visualmente. O teste de navegador comprova reprodução/decodificação na API, **não audição humana ou volume acústico calibrado**.
- Handler de ocultação da prévia exercitado com evento de visibilidade simulado: pausou sem retomar automaticamente. Esse teste não comprova comportamento de segundo plano/tela bloqueada do iOS. Sintaxe dos dois módulos de interface/áudio verificada.
- Pesquisa documentada em `AUDIO_RESEARCH.md`, com fontes primárias de estudos e fontes comerciais identificadas somente como evidência das associações populares.
- Acesso a áudios permanece `undecided`; nenhum plano, compra, entitlement ou cobrança foi configurado.

### Reproduzir as verificações de áudio

```powershell
node --test preview/model.test.mjs preview/audio-session.test.mjs
python tools/verify_audio.py
node preview/audio.browser.test.cjs
```

O segundo comando requer NumPy. O último requer Playwright, Edge e servidor em 127.0.0.1:8765. A geração reproduzível dos arquivos fica em `tools/generate_audio.py`, que usa somente bibliotecas padrão Python.

### O que continua pendente em iOS

Flutter/Dart/Xcode ausentes; `audioplayers 6.8.1` declarado, mas **sem resolução de dependências, pubspec.lock, análise, compilação ou teste Flutter**. A versão exige Flutter >=3.44/Dart >=3.6. Player nativo, interrupções, fones, rotas, timer real e lifecycle não foram testados. Sem background-audio mode ou controles de áudio de bloqueio; o código pausa ao sair da área/app. Reprodução de áudio em segundo plano/tela bloqueada é etapa futura e não foi confundida com o widget silencioso. Os fontes WidgetKit continuam preparados e não instalados no iPhone.

## Aprofundamentos opcionais e pesquisa do canal — 26/10/2026

### Implementação e conteúdo

- 24 reflexões originais, uma por ID de afirmação. Total atual **4223 palavras**, entre 166 e 185 por texto. Vínculo `messageId`, três parágrafos, origem e leitura automática explícitos no catálogo. Frases curtas do widget preservadas.
- Botão Aprofundar, leitura completa, voltar, controles Ouvir/Pausar/Continuar/Parar e cancelamento ao sair/ocultar. Hash link com cadastro e retomada; ID desconhecido tratado. Voz e player de tons permanecem separados, sem autoplay ou preço presumido.
- Fontes Flutter/Swift preparadas para tela de reflexão, flutter_tts, app_links e `.widgetURL`, com fragmento de URL scheme exclusivo do Runner. Pacotes não instalados ou compilados. O conjunto exige Dart >=3.12 e Flutter >=3.44, confirmados no pubspec oficial do app_links 7.2.2. Fragmentos plist validados como XML/plist; isso não valida assinatura, target ou execução.

### Evidência de testes

- **26 testes Node passaram, zero falhas**: 11 de catálogo/horários, 6 de tons, 4 de conteúdo/links de reflexão e 5 de controle de voz. Os cinco de voz usam API simulada, identificada nos nomes dos testes; não constituem prova de narração audível.
- Fluxo em Edge para reflexões: destino preservado durante cadastro, 24 textos conferidos contra o catálogo, ação Aprofundar/voltar, quatro larguras sem transbordamento, fallback sem engine, cancelamento ao mudar de área e link desconhecido.
- No serviço de voz **real** do Edge headless, Microsoft Daniel e Microsoft Maria locais pt-BR foram enumerados, mas a tentativa retornou erro de síntese. A interface informou falha e manteve leitura. **Não há confirmação de voz audível neste ambiente** nem arquivo humano narrado gerado.
- Captura de reflexão inspecionada visualmente. Sintaxe do JavaScript verificada. O teste inicialmente detectou aceitação de caminho normalizado `../`; a validação foi corrigida para verificar a forma bruta do URI antes de aceitar o ID, e o teste passou.
- Testes do fluxo anterior e do player de tons foram reexecutados para verificar preservação. Flutter, XCTest e execução de deep link no iPhone continuam não testados; falta SDK/Xcode.

### Cobertura editorial do canal

- Navegador público sem login mostrou cabeçalho de 139 vídeos e permitiu inventariar **139 URLs distintas** na aba Vídeos, até estabilizar a lista.
- **4 transcrições públicas obtidas; 2 lidas integralmente; 2 aguardam leitura; 135 vídeos têm somente metadados. Zero vídeos assistidos integralmente.** Leitura da íntegra disponível não cobre automaticamente imagem, áudio ou intervalos sem legenda; os limites 31:11/31:13 e 52:37/53:16 estão registrados.
- Duas reflexões revisadas com origem explícita após esse lote. Demais textos não foram apresentados como derivados dos vídeos não analisados. Matriz individual revisável em `CANAL_COBERTURA.md`/`canal_cobertura.json`; sem roteiro integral copiado.
- A análise de todos os vídeos **permanece em andamento**. O próximo lote é ler os dois textos já obtidos e continuar com os 135 restantes, com comparações às fontes primárias de Hill.

### Reprodução

```powershell
node --test preview/model.test.mjs preview/audio-session.test.mjs preview/reflections.test.mjs preview/narration-session.test.mjs
node preview/browser.test.cjs
node preview/audio.browser.test.cjs
node preview/reflections.browser.test.cjs
```

Os testes de navegador requerem Edge, Playwright e o servidor local na porta 8765. Os arquivos Dart `test/reflection_links_test.dart` e `test/domain_test.dart` estão preparados, mas não executados. O navegador automatizado não comprova voz audível, widget instalado ou funcionamento em iPhone.
