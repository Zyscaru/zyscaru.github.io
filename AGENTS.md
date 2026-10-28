# Instruções para trabalhar no Código em Jogo

Leia o [contexto do projeto](docs/codigo-em-jogo-contexto-e-branches.md), o [README](README.md) e o [fluxo de contribuição](CONTRIBUTING.md) antes de alterar código. O guia em `docs/` é a referência canônica para assistentes; confira os arquivos e o Git ao retomar uma tarefa.

- Preserve o visual, os textos, a navegação e o progresso quando a tarefa for apenas organização de código.
- O portal usa `assets/` e `dados/`. Cada app mantém seus recursos na própria pasta; não centralize motores, caches ou persistência dos apps sem uma tarefa específica.
- Preserve IDs de atividades, caminhos públicos e prefixos do `localStorage`. Não use `localStorage.clear()`.
- Cada service worker limpa somente os caches do próprio prefixo. Ao separar ou adicionar recursos, atualize o pré-cache e avance a versão do worker afetado.
- Prepare mudanças em uma branch de trabalho, com escopo explícito. As branches `app/...` organizam o trabalho; elas não limitam permissões sobre arquivos.
- Apresente o diff e a validação ao usuário antes de commit, push, abertura de PR ou merge, conforme a revisão conjunta combinada. Uma autorização específica na conversa pode aprovar essas etapas; não solicite novamente uma ação já aprovada.
- Execute `npm run check` ou, sem npm, `node scripts/check.mjs`. Para alterações no portal, confira também o comportamento no navegador e informe as limitações da validação.
- Atualize o contexto, o README e as orientações de contribuição na mesma mudança que alterar estrutura, comandos ou contratos. Evite registrar o estado momentâneo da árvore ou hashes de branches como se fossem informação permanente.
- Não publique credenciais, caminhos pessoais do computador ou dados de progresso reais na documentação.
