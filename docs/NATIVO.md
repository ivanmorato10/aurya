# O que exige o app nativo (Flutter / iOS / Android)

Esta versão é uma **aplicação web (PWA)** que reproduz o design e as funções. Não substitui os apps das lojas.
Exigem código nativo e testes em aparelhos:

- **Widgets** da tela de bloqueio e da tela inicial (iOS WidgetKit, Android App Widgets). Código preparado em `legacy/native/ios_integration/`, nunca compilado.
- **Áudio em segundo plano e com a tela bloqueada**, com controles na central de mídia. Na web, o áudio pausa ao sair do app.
- **Voz das afirmações com qualidade consistente.** Na web, depende das vozes instaladas no navegador ou aparelho.
- **Login com Apple e Google como nos apps**, e publicação nas lojas (assinaturas, ícones, privacidade).
- Notificações nos horários: **não estão no escopo aprovado**.

Os tokens visuais já estão prontos para o Flutter em `design/tokens/aurya_tokens.dart`.
