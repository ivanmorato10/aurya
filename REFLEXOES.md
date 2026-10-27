# Reflexões opcionais e leitura automática — 0.4

## O que está implementado

- 24 textos específicos, **4.230 palavras ao todo na redação inicial**, cada um com 150–250 palavras. As revisões editoriais posteriores mantêm a faixa e recalculam wordCount. Têm três parágrafos: desenvolvimento do sentido, conexão com propósito/confiança/iniciativa/atenção/disciplina/persistência e aplicação breve. A frase central é preservada.
- Na prévia: Aprofundar → texto completo → Ouvir/Pausar/Continuar/Parar → Voltar. Leitura opcional, sem autoplay, cobrança ou plano presumido. Voz e tons são controladores distintos; entrar na reflexão pausa tons, sair cancela voz.
- Hash público `#reflection/ID` permite verificar um destino específico. Sem cadastro concluído, o destino aguarda onboarding. Depois abre o ID validado, sem ler automaticamente. Alterar horário/período não muda uma reflexão que a pessoa já está lendo.
- Catálogo continua separado da UI. `messageId` corresponde ao ID da frase; o widget recebe somente a frase compacta e o ID, nunca os parágrafos.

## Voz: implementação e limites reais

A prévia usa [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis), selecionando voz com locale português e `localService=true`. Prefere pt-BR e pode usar outra variante portuguesa local, identificada no status. O idioma preferido do app pode estar pendente; o texto efetivo continua em português e a voz segue o texto efetivo. Não envia o texto a um serviço pago de geração nem produz um arquivo humano narrado.

A leitura ocorre por trechos para evitar uma única solicitação muito extensa. O estado de reprodução depende do evento de início. Falta de engine/voz, erro de síntese ou ausência de início em 4,5 s encerram a tentativa com aviso. Pausa e retomada dependem do motor. Cancelamentos invalidam callbacks antigos para impedir avanço de fila ao trocar de reflexão. Ocultar a página encerra voz; não há suporte prometido a narração com tela bloqueada/segundo plano.

**Teste real:** Edge headless enumerou Microsoft Daniel e Microsoft Maria (pt-BR, locais), mas a tentativa de síntese retornou erro. O fallback foi validado; nenhuma audição humana ou sucesso de voz nesse ambiente foi alegado. Os testes de sequência/pausa/retomada usam uma API simulada, explicitamente separada da evidência do navegador real. Em um navegador com motor funcional, o botão chama a síntese verdadeira. Texto permanece disponível em todos esses estados.

Flutter prepara [flutter_tts 4.2.5](https://pub.dev/packages/flutter_tts/versions/4.2.5), com disponibilidade de voz portuguesa, callbacks, watchdog, pausa e stop ao sair. A seleção de voz instalada e seu comportamento offline precisam ser verificados em aparelho; a API do plugin tem diferenças de plataforma. No Android, o pacote documenta suporte de pausa por workaround a partir da API 26. Não foi criada gravação nem ativada a própria voz Premium.

## Deep link do widget: preparar no Mac

O Swift acrescenta `messageId` à entrada e `.widgetURL` para abrir `aurya://reflection/ID`. Placeholders não têm URL de reflexão. A Apple documenta esse padrão em [linking to specific app scenes](https://developer.apple.com/documentation/widgetkit/linking-to-specific-app-scenes-from-your-widget-or-live-activity). O widget permanece retangular, curto, silencioso e com timeline dos quatro momentos.

1. Siga `IOS_WIDGET.md` para o target nativo e App Group. O arquivo `Info.fragment.plist` continua sendo a chave de App Group para ambos os targets.
2. Mescle **somente no Info.plist do Runner** o novo `ReflectionLinks.Runner.fragment.plist`, com scheme `aurya` e `FlutterDeepLinkingEnabled=false`. Preserve os outros URL Types do aplicativo. O scheme é de desenvolvimento; revisar sua identidade antes de publicação.
3. Resolva [app_links 7.2.2](https://pub.dev/packages/app_links/versions/7.2.2) em Flutter >=3.44/Dart >=3.12 e siga a configuração iOS do pacote para o lifecycle gerado pelo Flutter atual. O código instancia o plugin cedo e assina `uriLinkStream`, que contempla link inicial e links recebidos com app aberto. Não cole um AppDelegate antigo sobre o template recente.
4. Execute `flutter pub get`, analyze e test; gere o lockfile real. Compile Runner e extensão e teste abrir o link com sessão demo ausente/presente, app fechado/aberto, ID válido/desconhecido e ausência de voz. O destino pendente fica só em memória na demonstração.
5. No iPhone, toque na frase do widget. Verifique se abre o texto daquela **mesma frase**, mesmo após a troca de horário. O app consulta o catálogo por ID, não recalcula o conteúdo do destino. Nenhum áudio deve iniciar com o toque.

Não foi gerado Xcode project, instalado plugin, compilado Swift/Flutter ou testado iPhone nesta etapa Windows. URL schemes e app_links preparados não comprovam funcionamento nativo. Android continua previsto; intent-filter do scheme e queries de TTS precisam ser integrados no manifest gerado conforme a documentação dos plugins.

## Direção editorial e origem

Propósito, fé aplicada/autoconfiança, iniciativa, atenção, autodisciplina e persistência orientam textos originais, com foco em prosperidade, abundância, riqueza e gratidão. As referências da Fundação permanecem no README. Não há reprodução de livros, atribuição das novas frases a Hill ou endosso oficial.

O canal indicado pelo usuário tem matriz de cobertura própria. As reflexões anteriores à leitura de seus vídeos são conteúdo editorial provisório inspirado nas referências da Fundação. Neste lote, `wake-dignidade-01` e `sleep-descanso-01` receberam revisões originais após leitura integral de duas transcrições públicas, com metadados `reviewReferences`. As outras 22 mantêm a origem editorial anterior. Isso não transforma nenhum texto em citação ou transcrição. O levantamento contém 139 vídeos; a análise integral de todo o canal ainda não está concluída.
