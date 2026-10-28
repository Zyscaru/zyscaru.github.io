# Código em Jogo: contexto, arquitetura e branches

Referência canônica para pessoas e assistentes que trabalham neste repositório. Última revisão: 28/10/2026. Este documento fornece contexto e instruções; não treina o modelo nem substitui a leitura do código atual.

Leia também o [README](../README.md), as [instruções para assistentes](../AGENTS.md) e o [fluxo de contribuição](../CONTRIBUTING.md). Ao retomar uma tarefa, confira o estado do Git e os arquivos afetados. O histórico de commits informa quais mudanças foram efetivamente integradas.

## Produto e escopo

O **Código em Jogo** é uma plataforma em português para aprender Python, Java, JavaScript e SQL com cursos e jogos. O portal oferece quatro trilhas, cada uma com um curso do zero e três jogos.

Este repositório contém o portal e os oito apps de JavaScript e SQL. Os oito apps de Python e Java aparecem no catálogo, mas seus códigos não estão nesta árvore. Não crie substitutos nem remova os links apenas por essa ausência; investigue sua origem e publicação antes de alterá-los.

A estrutura do portal segue a separação de responsabilidades usada como referência no projeto `ProjectSitePortfolio`: HTML, estilos, scripts, dados, imagens, ferramentas locais e documentação em lugares próprios. O curso continua sendo um site estático servido diretamente. A reorganização não exige React, Vite, templates ou uma etapa de geração.

## Organização atual

```text
index.html                 Estrutura e conteúdo estático do portal
assets/
  css/base.css             Regras básicas e compatibilidade
  css/portal.css           Visual e responsividade existentes
  js/main.js               Inicialização do portal
  js/portal.js             Cartões, abas, totais e navegação
  js/progresso.js           Cálculo do progresso por app
  js/storage.js            Leitura e gravação no localStorage
  js/pwa.js                Registro do service worker
  images/apps/             Ícones dos 16 apps, extraídos dos dados originais
dados/apps.js              Catálogo: IDs, descrições, caminhos, prefixos e totais
icons/                     Ícones de instalação do portal
manifest.webmanifest       Instalação do portal como PWA
sw.js                      Pré-cache e atualização offline do portal
scripts/check.mjs          Verificação de estrutura/documentação e testes
scripts/preview.mjs        Servidor de desenvolvimento em 127.0.0.1:4173
tests/                     Testes automatizados, sem dependências externas
docs/                      Contexto e documentação técnica
AGENTS.md                  Entrada de instruções para assistentes
CONTRIBUTING.md             Fluxo de contribuição e revisão
```

O portal carrega módulos JavaScript nativos. Use o servidor local; abrir o HTML por `file://` não reproduz o carregamento de módulos nem a PWA.

As pastas dos oito apps conservam seus `index.html`, `sw.js`, `manifest.webmanifest`, ícones e READMEs. Nessas páginas, CSS, conteúdo e motores ainda estão embutidos no HTML. A extração dos recursos dos apps é uma tarefa posterior, por app, com testes de seus motores e atividades. Não descreva essa migração como concluída.

## Apps, progresso e branches

| Pasta | Função | Prefixo de progresso | Branch de manutenção |
|---|---|---|---|
| `caderno-javascript/` | Curso JavaScript do zero | `cjs:` | `app/caderno-javascript` |
| `voo-da-abelha/` | JavaScript iniciante | `va:` | `app/voo-da-abelha` |
| `ferrovia-do-futuro/` | JavaScript intermediário | `ff:` | `app/ferrovia-do-futuro` |
| `estacao-kepler/` | JavaScript avançado | `ek:` | `app/estacao-kepler` |
| `caderno-sql/` | Curso SQL do zero | `csql:` | `app/caderno-sql` |
| `misterio-no-museu/` | SQL iniciante | `mm:` | `app/misterio-no-museu` |
| `aeroporto-horizonte/` | SQL intermediário | `ah:` | `app/aeroporto-horizonte` |
| `base-amazonia/` | SQL avançado | `ba:` | `app/base-amazonia` |

O portal usa `cg:` para a aba selecionada e o último app aberto. Os demais prefixos, caminhos públicos e totais do catálogo estão em [dados/apps.js](../dados/apps.js); consulte esse arquivo em vez de manter uma segunda lista de números na documentação.

As branches foram organizadas por app a pedido do usuário. Cada branch contém o repositório inteiro; o nome não impede alterações em outras pastas nem isola os dados no navegador. Limite o diff ao objetivo da tarefa e revise alterações compartilhadas. `main` reúne o trabalho aprovado. Antes de reutilizar uma branch de app, confira se precisa integrar atualizações da `main`.

## Contratos que devem ser preservados

### Visual e navegação

Uma tarefa de organização preserva aparência, conteúdo, ordem das trilhas, cartões, URLs públicas e comportamento do botão Continuar. Os ícones em `assets/images/apps/` são os mesmos PNGs antes embutidos no HTML; não são novas ilustrações. A fonte externa e as regras de tema/responsividade permanecem as existentes.

### Progresso

Os cadernos guardam IDs de atividades concluídas em `<prefixo>done`; os jogos usam `<prefixo>stars`. Os apps também guardam código e preferências no `localStorage`. O portal lê esses dados para mostrar totais e percentuais. Ao adicionar atividades, ajuste os totais em `dados/apps.js`. Alterações de IDs ou formato salvo exigem uma migração planejada.

O cache offline guarda arquivos; o `localStorage` guarda o progresso. A correção do cache não é backup do aluno. Apagar dados do site pelo navegador pode remover o progresso de vários apps da mesma origem. Exportação/importação de progresso e sincronização entre aparelhos não foram implementadas nesta reorganização.

### Execução dos exercícios

Os motores JavaScript usam Web Workers, com alternativa sem Worker. Os apps SQL incluem SQLite/WebAssembly. Seu conteúdo e seus motores continuam nas próprias páginas. Uma alteração neles exige verificar correção de respostas válidas e inválidas, timeout, entradas e comportamento das atividades afetadas.

### Offline

O [sw.js do portal](../sw.js) pré-armazena o HTML, manifesto, ícones, CSS, módulos e catálogo. Todo recurso necessário ao carregamento do portal deve estar em `ARQUIVOS`. Ao adicionar ou mover recursos, atualize essa lista e avance `VERSAO`, preservando o prefixo `portal-`.

Cada app tem seu próprio worker e prefixo de cache. A limpeza de versões antigas deve selecionar somente nomes com o prefixo do próprio app, preservando sua versão atual. O cache compartilhado `fontes` e os caches dos demais apps devem continuar intactos. A fonte de verdade das versões é cada `sw.js`, não exemplos antigos de documentação.

## Desenvolvimento e validação

Com Node.js 24, sem instalar dependências:

```powershell
npm run check
npm test
npm run preview
```

Se o ambiente disponibilizar apenas Node, use `node scripts/check.mjs`, `node --test tests/*.test.cjs` e `node scripts/preview.mjs`, respectivamente. Não é necessário instalar npm para executar essas verificações.

`check` verifica a separação do portal, os links locais dos documentos e executa os testes. `test` executa somente os testes. `preview` serve os arquivos diretamente em `http://127.0.0.1:4173`. Não há build ou pasta `dist/` para publicar.

Os testes de cache usam os service workers reais em um ambiente simulado. Os testes do portal verificam cálculo e preservação de progresso, armazenamento indisponível e cobertura dos recursos no pré-cache. A validação de layout e de ciclo de vida real da PWA no navegador é complementar. Registre no PR o que foi realmente executado; não trate uma simulação como validação de instalação em celulares.

O portal aponta para GitHub Pages. A branch/pasta ou workflow de publicação deve ser confirmado em `Settings > Pages` antes de alterar a hospedagem. Uma nova branch ou um PR não implica automaticamente uma prévia publicada.

## Como manter esta referência atualizada

1. Mudou caminhos ou responsabilidades? Atualize a árvore acima e a tabela de edição em `CONTRIBUTING.md`.
2. Mudou comandos ou ferramentas? Atualize o `README`, este guia e `package.json` juntos.
3. Mudou dados persistidos ou caches? Atualize os contratos e os testes, preserve compatibilidade e documente uma eventual migração.
4. Migrou um app? Registre sua organização real e remova a indicação de HTML monolítico apenas para os apps já migrados.
5. Execute `npm run check` e revise a documentação no mesmo diff do código antes do envio.

Esses passos são parte de cada manutenção; não há um serviço de atualização automática deste Markdown. `AGENTS.md` direciona futuros assistentes a esta referência. A cópia antiga fora do repositório deve apontar para cá, evitando dois guias contraditórios.

## Histórico confirmado

- **28/10/2026 — [PR #1](https://github.com/Zyscaru/zyscaru.github.io/pull/1):** correção da limpeza de cache nos oito apps e inclusão dos testes de regressão. O merge foi confirmado na `main`.
- **28/10/2026 — branches por app:** oito branches criadas a partir da `main` que já continha a correção. Seus ponteiros podem avançar depois; consulte o Git para o estado atual.

O fluxo combinado com o usuário exige apresentar mudanças e validação para revisão conjunta antes de commit e envio. Autorizações específicas na conversa podem aprovar etapas completas. Consulte [CONTRIBUTING.md](../CONTRIBUTING.md) para os comandos e a integração por PR.
