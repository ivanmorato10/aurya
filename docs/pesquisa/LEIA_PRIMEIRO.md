# AURYA — pacote atualizado em 27/10/2026

## O que está pronto nesta entrega

- Código Flutter, testes e fontes de integração Swift/WidgetKit.
- Prévia web independente, quatro horários configuráveis e cadastro fictício.
- Quatro exemplos com citações de Hill, fontes, tradução e aprofundamentos editoriais identificados. O restante do catálogo de 24 mensagens ainda contém textos originais e precisa de revisão conforme o critério novo do usuário.
- Leitura pelo sistema, tom mais grave e trilha de piano original opcional nos aprofundamentos. A voz depende do dispositivo; não é a voz da conversa.
- Áudios com 33 faixas: três melodias (Aurora, Horizonte e Acolhimento) para cada uma das 11 frequências de referência. A frequência é uma referência de afinação por oitavas; música contém várias notas. Sem promessa de efeito financeiro ou clínico.
- Pesquisa do canal: quatro transcrições analisadas; 135 vídeos só com metadados. Não houve visualização integral dos vídeos.

## GitHub

Extraia o ZIP e use a pasta `aurya` como raiz do repositório. `pubspec.yaml`, `vercel.json` e `codemagic.yaml` ficam nessa raiz. Os WAVs são arquivos locais de poucos megabytes cada. Não há credenciais, conta real, autenticação de produção, cobrança ou servidor de usuários configurado. O ZIP não publica nada por conta própria.

## Vercel — publicar somente a prévia web

Importe o repositório do GitHub. Root Directory: a pasta que contém `vercel.json` (raiz do repositório se tiver enviado o conteúdo de `aurya`). O arquivo já define Framework Other, comando `node tools/prepare-web.mjs` e saída `web-deploy`. O comando copia apenas os arquivos públicos necessários e as músicas atuais. A raiz redireciona para `/preview/`.

A publicação é uma demonstração web; não instala o widget no iPhone. Recarregar perde o cadastro/preferências fictícios. Não são necessários serviços pagos ou chaves para a prévia. Não usar o endereço localhost como link público; a Vercel fornecerá outro endereço após a implantação.

## Codemagic — primeiro verificar o código Flutter

Conecte o repositório e selecione `aurya-validation`, definido em `codemagic.yaml`. O fluxo resolve dependências, analisa e roda testes; não compila nem publica IPA/APK. Usa Flutter stable, que precisa atender ao pubspec: Flutter >=3.44 e Dart >=3.12. Se a versão disponível não atender, selecione uma versão compatível no YAML antes de executar.

O fluxo não foi executado no Codemagic nesta entrega. Flutter, Dart e Xcode não estavam disponíveis no ambiente local; possíveis falhas de análise/testes nativos precisam ser resolvidas no ambiente compatível.

Para gerar o app instalável ainda é necessário criar e versionar os projetos iOS/Android, definir identificadores próprios, integrar a extensão WidgetKit e App Groups conforme `IOS_WIDGET.md`, configurar assinatura/certificados e só então adicionar um fluxo de build/publicação. Não há projeto Xcode pronto neste pacote. Não basta apertar build para obter o widget funcionando.

## Verificações e limites

As verificações Node do player e do conteúdo estão em `preview/*.test.mjs`. Os testes de voz são simulações de controle, não audição humana. A música aprovada no aprofundamento foi testada pelo usuário; as três novas opções por frequência ainda precisam de avaliação auditiva. A verificação dos 33 arquivos checou duração, limites de amplitude, variação de notas e três versões diferentes por frequência.

Há diferença entre a prévia e o Flutter: o fundo musical e a apresentação detalhada das fontes estão implementados na prévia; a integração nativa correspondente ainda precisa ser finalizada. As imagens PNG do pacote são registros anteriores e podem não representar a interface atual.

Documentação anterior em README/VALIDACAO/REFLEXOES/AUDIO_RESEARCH registra etapas do desenvolvimento e pode descrever os tons antigos. Este arquivo e o catálogo atual têm prioridade para o estado da entrega.

Referências: https://vercel.com/docs/project-configuration/vercel-json e https://docs.codemagic.io/yaml-quick-start/building-a-flutter-app/.
