# Como contribuir

## Preparar a tarefa

1. Leia o [README](README.md), o [guia de contexto](docs/codigo-em-jogo-contexto-e-branches.md) e as [instruções para assistentes](AGENTS.md).
2. Confira `git status --short --branch`. Preserve mudanças pendentes antes de trocar de tarefa.
3. Com a árvore limpa, selecione `main` e execute `git pull --ff-only origin main`. Se os históricos divergirem, inspecione os commits antes de integrar.
4. Use uma branch com objetivo claro. Para o portal ou mudanças transversais, use por exemplo `refactor/organizar-portal-e-documentacao`. Para manutenção de um app, use sua branch `app/...` combinada com o responsável ou uma branch curta, como `fix/caderno-sql-enunciado`.

As oito branches por app estão relacionadas no guia. Antes de reutilizar uma delas, confira seu conteúdo e integre a `origin/main` atual com a árvore limpa. Não sobrescreva trabalho existente nem use push forçado para evitar conflitos.

## Onde editar

| Mudança | Arquivo ou diretório |
|---|---|
| Estrutura e textos estáticos do portal | `index.html` |
| Visual do portal | `assets/css/` |
| Cartões e navegação do portal | `assets/js/portal.js` |
| Cadastro de apps, totais e prefixos | `dados/apps.js` |
| Cálculo do progresso e persistência | `assets/js/progresso.js` e `assets/js/storage.js` |
| Offline do portal | `sw.js` e `assets/js/pwa.js` |
| Aulas, exercícios e motores de um app | Pasta do próprio app |
| Orientações do projeto | `README.md`, `AGENTS.md`, este arquivo e o guia em `docs/` |

## Validar

Use Node.js 24, sem instalar dependências:

```powershell
npm run check
npm run preview
```

Sem npm, execute `node scripts/check.mjs` e `node scripts/preview.mjs`. Para executar somente os testes, use `node --test tests/*.test.cjs`.

Abra `http://127.0.0.1:4173`. O projeto é servido diretamente: não há diretório `dist/` nem etapa de build. Encerre a prévia com `Ctrl+C`.

Confira as quatro abas, o cartão Continuar, os totais, a navegação por teclado, os layouts de celular/computador e o progresso depois de recarregar. Para mudanças no offline, confira a abertura sem rede e a coexistência com outro app. Use um perfil de teste; não apague dados reais dos alunos.

Os testes automatizados simulam o ciclo de vida do service worker e verificam cache, recursos locais, catálogo e progresso. Eles complementam a validação de instalação e atualização no navegador.

Se adicionar recursos do portal, inclua-os em `ARQUIVOS`, no `sw.js`, e avance `VERSAO`. Cada worker deve remover apenas caches antigos do próprio prefixo. Consulte a versão no código, em vez de copiar um número de um exemplo antigo do README de um app.

## Revisar e enviar

1. Confira `git diff --check` e `git diff`.
2. Apresente ao usuário os arquivos alterados, o resultado dos testes e eventuais limitações. A revisão conjunta antes de commit e envio é parte do fluxo deste projeto.
3. Após a aprovação, prepare somente os arquivos da tarefa com `git add -- <arquivos>` e revise `git diff --cached`.
4. Registre uma mudança completa com mensagem descritiva e envie a branch com `git push -u origin <branch>`.
5. Abra o PR para `main`, explicando o problema, o resultado e a validação. Mudanças de escopo exigem atualizar a descrição.
6. Após a aprovação da integração, faça o merge, confira a publicação configurada no GitHub Pages e atualize a `main` local.

Quando o código mudar de lugar, atualize os links, o cache e a documentação no mesmo PR. As instruções públicas devem descrever a organização atual; relatos antigos ficam no histórico do Git ou claramente identificados como histórico.
