# AURYA • Desenvolvimento 0.4

A experiência principal passa a ser **ler uma afirmação no widget da tela de bloqueio do iPhone, sem abrir o app**. O app serve para configurar quatro momentos: **ao acordar, indo para o trabalho, meio do dia e antes de dormir**. Isso substitui a versão de dois períodos.

Esta entrega contém código Flutter, código Swift/WidgetKit para integração e uma prévia web independente. Nenhum widget foi compilado, instalado ou validado em iPhone. Não há publicação ou contratação de serviços. O visual é autoral, provisório e revisável; feeds do Instagram não foram analisados.

## Testar a prévia agora

Abra **http://127.0.0.1:8765/preview/** enquanto o servidor desta sessão estiver ativo. Para reabrir:

1. Abra PowerShell nesta pasta e execute `powershell -ExecutionPolicy Bypass -File .\INICIAR_PREVIA.ps1`. A opção vale somente para esse processo.
2. Abra o endereço acima. Use o e-mail fictício já preenchido para o cadastro obrigatório de demonstração.
3. Escolha o idioma. Só português tem conteúdo nesta etapa; os demais exibem tradução pendente.
4. Edite os **quatro** horários. Todos os valores iniciais estão identificados como **exemplos editáveis**, não como horários aprovados ou escolhidos pelo usuário.
5. Abra a revisão da tela de bloqueio. Selecione cada momento para simular suas frases ou volte ao relógio local.
6. O controle de privacidade oculta a frase **somente na simulação**. O botão de exportação baixa um JSON de exemplo; não instala ou agenda um widget.
7. Em Meus horários, ajuste e guarde nesta sessão. Recarregar limpa a prévia. Sair exige novo cadastro fictício; apagar também redefine preferências.

O script usa Python do runtime do Codex neste computador, ou Python instalado em outro ambiente. Alternativa: `python -m http.server 8765 --bind 127.0.0.1` nesta pasta. Abrir o HTML diretamente não carrega o catálogo. Mantenha a janela do servidor aberta; Ctrl+C encerra. Se a porta estiver ocupada, use o servidor anterior ou altere porta/endereço.

## Aprofundar uma afirmação

Na mensagem, toque em **Aprofundar**. Cada uma das 24 afirmações tem um texto original próprio, com 150–250 palavras, ligado ao seu sentido, a um princípio de Hill e a uma aplicação pessoal breve. Você pode ler, voltar à afirmação ou solicitar **Ouvir**. Nada inicia automaticamente. A leitura automática é separada do player de tons; o acesso Free/Premium deste recurso está **a definir**, sem paywall.

As reflexões estão em `translations.pt-BR.reflection` no catálogo compartilhado: título, princípio editorial, três parágrafos, vínculo ao ID da afirmação e metadados de narração. Não são transcrições, trechos de livros ou citações atribuídas a Napoleon Hill. As 24 frases curtas do widget e os quatro horários permanecem preservados.

**Voz na prévia:** implementação real da Web Speech API, somente com voz local em português. Depende do navegador/sistema. A UI só indica reprodução após evento de início; quando faltar voz ou o mecanismo falhar, informa a indisponibilidade e mantém o texto. Pausar/Continuar usa o suporte do motor; Parar, voltar, trocar de área ou ocultar a página cancela a leitura. Não há arquivo narrado por pessoa, voz clonada ou contratação de serviço de voz. **No Edge headless deste ambiente foram encontradas duas vozes portuguesas, mas o motor retornou erro; não foi validada narração audível.** Os testes de controles com API simulada são identificados como tais.

**Abrir pela frase do widget:** fontes nativas preparadas usam `aurya://reflection/ID_DA_AFIRMACAO`. O app valida o ID e mantém o destino pendente até concluir cadastro/onboarding de demonstração; uma sessão já aberta pode acessar diretamente. Não toca voz. Na prévia, é possível verificar o mesmo fluxo com `http://127.0.0.1:8765/preview/#reflection/wake-prosperidade-01` — abrir em sessão nova exige cadastro e depois retoma o texto certo. URLs desconhecidas geram aviso e não executam comandos.

Flutter inclui `reflection_screen.dart`, `reflection_links.dart`, dependências fixadas `flutter_tts: 4.2.5` e `app_links: 7.2.2`. O conjunto agora exige **Dart >=3.12 e Flutter >=3.44**, conforme os metadados oficiais dos pacotes. Não foram resolvidos, compilados ou testados no Flutter aqui. Veja [REFLEXOES.md](REFLEXOES.md) para integrar voz/deep links e os limites de iOS.

## Áudios: testar a nova área

Depois do cadastro, escolha **Áudios** na navegação. Há três temas — **Prosperidade, Riqueza e Gratidão** — e 11 amostras originais de tons. Selecione a faixa e toque em Reproduzir; não há autoplay. Use Pausar/Continuar, Encerrar, volume (inicial 15%) e temporizador de 1, 5, 10 ou 15 minutos. Pausar congela o tempo restante; trocar faixa reinicia a sessão sem tocar automaticamente. Alterar o temporizador redefine sua duração a partir daquele momento.

Os arquivos têm 12 segundos e são repetidos durante a sessão. São amostras sonoras sintéticas de tom puro, não composições musicais completas. Incluem 174, 285, 396, 417, 432, 528, 639, 741, 852, 888 e 963 Hz. A associação de cada faixa a um tema é editorial. O foco continua nas afirmações positivas de prosperidade, abundância, gratidão e riqueza; a pesquisa e suas distinções ficam no documento [AUDIO_RESEARCH.md](AUDIO_RESEARCH.md).

**O acesso Free/Premium aos áudios ainda será decidido.** A demonstração permite ouvi-los, sem declarar inclusão em plano, compra ou cobrança. Isso é separado da futura gravação/reprodução da própria voz Premium.

Na prévia, sair da área ou ocultar a página pausa o áudio. Não há reprodução automática quando uma frase/widget troca. **Áudio com a tela bloqueada ou em segundo plano não está habilitado nem validado**. O mock da tela bloqueada é somente visual.

Arquivos e origem: `assets/audio_catalog.json` separa temas, caminhos, Hz reais, direitos/origem e acesso `undecided`; `assets/audio/` contém WAVs gerados localmente por `tools/generate_audio.py`. Sem download de música ou voz de terceiros. Para conferir o sinal, `python tools/verify_audio.py` requer NumPy; a prévia só precisa do servidor local e navegador.

Flutter tem a tela `lib/audio_screen.dart`, assets declarados e dependência **audioplayers 6.8.1** fixada, com API verificada na [documentação do pacote](https://pub.dev/packages/audioplayers/versions/6.8.1). O pacote de áudio isoladamente exige **Dart >=3.6 e Flutter >=3.44**; com o novo app_links, o projeto exige **Dart >=3.12** conforme o [pubspec oficial](https://github.com/bluefireteam/audioplayers/blob/audioplayers-v6.8.1/packages/audioplayers/pubspec.yaml). O plugin não foi baixado/resolvido nem compilado aqui: executar `flutter pub get`, analisar, testar e gerar `pubspec.lock` em ambiente compatível. Não há lockfile fabricado. A implementação nativa preparada usa assets locais, loop, volume inicial baixo, temporizador e pausa de lifecycle. Validar áudio iOS, interrupções, rotas, fones e relógio em aparelho antes de uso real.

## Comportamento dos quatro momentos

- Quatro horários locais válidos e diferentes; nenhuma ordem de categoria é imposta, permitindo rotina de trabalho noturna.
- A categoria ativa é a última ocorrência cronológica. Ela permanece até a próxima, inclusive após meia-noite. A mensagem é escolhida pela data **do início do momento**, não pela data em que foi consultada.
- Há uma afirmação por ocorrência. No dia seguinte a categoria pode receber outra amostra, mas não há rotação durante o intervalo, animação, carrossel ou atualização contínua.
- A prévia e o app programam um único disparo para a próxima fronteira; não consultam a mensagem a cada poucos segundos. Retomar a tela recalcula o momento atual. Os relógios grandes do mock mostram o horário configurado do momento, não um relógio em atualização ao vivo.
- WidgetKit recebe uma timeline futura com transições planejadas. O iOS controla atualização, aparência e privacidade; não é possível prometer pontualidade exata.
- Horários muito próximos podem ser agrupados pelo iOS. O aplicativo aceita horários distintos, mas isso não elimina limites do sistema.

## Conteúdo separado da UI

`assets/content.json` é o catálogo compartilhado. Contém os quatro IDs (`wake`, `commute`, `midday`, `sleep`), oito locales previstos e 24 afirmações originais em português, com seis entradas por momento.

As frases são pessoais, curtas, em primeira pessoa e no presente: **Eu sou próspero**, **Eu sou abundante**, **Eu sou capaz**, **Eu sou grato**, **Eu confio em mim**, **Eu mereço descansar em paz**, **Eu sou digno de prosperar**, **Eu reconheço a abundância em minha vida** e **Eu construo riqueza com propósito**, entre outras coerentes. Não são promessas de resultado financeiro ou clínico.

### Referência editorial: Napoleon Hill

As afirmações são textos originais do AURYA inspirados em propósito definido, fé aplicada/autoconfiança, iniciativa pessoal, autodisciplina, atenção dirigida, planejamento e persistência. A ênfase é combinar intenção com ação: “Eu tenho um propósito claro”, “Eu confio em mim e ajo com decisão”, “Eu construo minha prosperidade com foco e ação”, “Eu persisto e aprimoro meu plano” e “Eu reconheço meu progresso e preparo meu próximo passo”. “Eu sou próspero” e “Eu sou abundante” permanecem por preferência expressa do usuário; não são apresentadas como citações de Hill.

Referências primárias: [Napoleon Hill Foundation — Ezine 530, 17/03/2017](https://www.naphill.org/ezine/ezine-530/), que aborda iniciativa, propósito, disciplina e persistência; e [Ezine 936, 13/12/2024](https://www.naphill.org/ezine/ezine-936-dec-13-2024/), sobre atenção, propósito e planejamento. Nesta atualização, o acesso direto retornou HTTP 403; foram consultados os conteúdos indexados dessas páginas. Não houve reprodução de trechos, atribuição das novas frases a Hill, associação ou endosso oficial da Fundação. A referência serve à direção editorial, sem promessas de enriquecimento ou benefícios clínicos. Esses detalhes ficam na documentação e no catálogo, sem acrescentar avisos ao fluxo do app.

Cada item tem ID estável, `moment`, tema e `translations.pt-BR` com `title`, `body` e `widget`. A prioridade atual é a frase curta; `body` e `widget` usam a mesma afirmação. Podem ser editados sem refazer telas. A versão compacta nativa aceita até 100 caracteres, mas o encaixe real depende da fonte e do dispositivo. Adicionar/reordenar conteúdo pode mudar a distribuição diária; um calendário editorial fixo poderá ser definido depois, se necessário.

Os outros sete idiomas são preferências registradas na sessão, sem tradução de interface ou catálogo. O aviso de português é um comportamento provisório da demonstração, não uma política de fallback aprovada para produção.

## Estrutura

| Arquivo/pasta | Função |
|---|---|
| `lib/domain.dart` | Quatro horários, ocorrências e seleção que atravessa meia-noite |
| `lib/content_repository.dart` | Catálogo e distribuição diária |
| `lib/widget_bridge.dart` | Contrato Flutter → iOS, exportação e limpeza |
| `lib/main.dart` | Cadastro fictício, configuração, revisão e estados honestos da ponte |
| `ios_integration/Shared` | Modelo validado, armazenamento App Group e motor de timeline |
| `ios_integration/Widget` | WidgetKit/SwiftUI, somente `accessoryRectangular` |
| `ios_integration/Runner` | Ponte MethodChannel; solicitação de reload após alteração/limpeza |
| `ios_integration/Tests` | Testes XCTest preparados, não executados |
| `ios_integration/widget-config-example.json` | Mesmo contrato exportável na prévia, somente dados de demonstração |
| `preview/` | Prévia web, reflexões, síntese de voz, player de tons independente e testes executados |
| `lib/reflection_screen.dart` / `lib/reflection_links.dart` | Leitura/voz Flutter e validação do destino |
| `REFLEXOES.md` | Integração de leitura automática, deep links e limitações |
| `assets/audio_catalog.json` / `assets/audio/` | Catálogo de áudios com acesso a definir e 11 WAVs locais |
| `lib/audio_screen.dart` | Player Flutter preparado, ainda não compilado |
| `AUDIO_RESEARCH.md` | Associações populares, estudos consultados, origem e limites |
| `IOS_WIDGET.md` | Integração Xcode, fontes Apple, limites e roteiro de teste real |
| `VALIDACAO.md` | Evidência desta entrega e verificações ainda pendentes |

## Flutter e iOS

Flutter, Dart, Swift e Xcode não estão disponíveis neste Windows. **Não há APK/IPA, projeto Xcode configurado, análise estática ou teste nativo executado.** O código é uma preparação revisável, não um binário validado.

Em uma cópia desta pasta, com Flutter estável recente instalado:

```powershell
flutter doctor
flutter create --platforms=android,ios --project-name=aurya .
flutter pub get
flutter analyze
flutter test
flutter run
```

Preserve `lib/`, `assets/`, `test/` e `pubspec.yaml`. O comando gera os invólucros de plataforma que ainda não existem. Android exige SDK/dispositivo. **A integração e compilação do widget iPhone exigem macOS, Xcode, target Widget Extension, App Group real e assinatura de desenvolvimento**; siga `IOS_WIDGET.md`. Gerar o projeto Flutter não adiciona automaticamente a extensão. A ponte retorna indisponibilidade quando não está integrada e não afirma instalação.

## Dados, privacidade e integrações futuras

Cadastro da demonstração não cria conta real, não solicita senha e deve usar dados fictícios. No navegador tudo fica em memória, sem localStorage, cookies, serviços de analytics ou escrita no servidor.

No Flutter, a sessão também fica em memória. **Se a ponte nativa for integrada e a pessoa autorizar explicitamente nas preferências**, um snapshot de frases públicas e horários fica persistido no App Group para o widget funcionar com o app fechado. Não contém nome, e-mail, voz ou credenciais. Não é prova de autenticação. Sair/apagar solicita limpeza e reload, mas o iOS pode demorar a substituir uma imagem já renderizada. Falhas são informadas. Reiniciar o app não apaga por si só o snapshot: isso é intencional para leitura sem reabrir o aplicativo e exige revisão de ciclo de conta na futura auth real.

O widget respeita `.privacySensitive()` e os ajustes do iOS; não tenta contornar bloqueio de acesso ou redaction. Não pede notificações, não usa notificações como substituição, não usa Live Activities e não inclui anúncios no bloqueio. A simulação não reproduz segurança, Always On ou regras reais do iOS.

Auth/backend, anúncios Free no app, preços, compras/restauração e gravação/reprodução da própria voz Premium continuam integrações futuras. Sem cobranças, microfone ativo ou fornecedor configurado. O widget não foi condicionado a Premium nesta demonstração. O painel editorial não faz parte desta entrega.

## Pesquisa do canal indicado

O canal `@LeisDoTriunfoBR`, confirmado pelo usuário, é referência de pesquisa para ideias e desenvolvimento original interno, não um link colocado no lugar do conteúdo. Inventário, cobertura e distinção entre texto editorial provisório e análises de vídeos ficam em `CANAL_COBERTURA.md` e `canal_cobertura.json`. Nenhum texto existente é apresentado como derivado de vídeos ainda não analisados.


### Atualização de áudios: escolha de melodia

O catálogo musical atual tem 33 faixas: Aurora, Horizonte e Acolhimento para cada uma das 11 frequências de referência. Tema, frequência e melodia são seleções separadas na prévia. As composições diferem em melodia e progressão harmônica; não são apenas transposições. A frequência é referência de afinação por oitavas, não um tom constante nem uma alegação de efeito financeiro ou clínico. O volume inicial continua em 15%, com pausa, encerramento e temporizadores. A implementação Flutter foi atualizada, mas não compilada nesta máquina.
