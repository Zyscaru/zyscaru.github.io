# Código em Jogo

Plataforma para aprender **Python**, **Java**, **JavaScript** e **SQL** jogando. Esta é a página inicial (https://zyscaru.github.io/), que reúne as quatro trilhas e mostra o progresso de cada app:

| Nível | Trilha Python | Trilha Java | Trilha JavaScript | Trilha SQL |
|---|---|---|---|---|
| Do zero (curso) | [Caderno de Python](https://zyscaru.github.io/caderno-python/) | [Caderno de Java](https://zyscaru.github.io/caderno-java/) | [Caderno de JavaScript](https://zyscaru.github.io/caderno-javascript/) | [Caderno de SQL](https://zyscaru.github.io/caderno-sql/) |
| Iniciante | [Robô Py](https://zyscaru.github.io/robo-py/) | [Rover em Marte](https://zyscaru.github.io/rover-marte/) | [Voo da Abelha](https://zyscaru.github.io/voo-da-abelha/) | [Mistério no Museu](https://zyscaru.github.io/misterio-no-museu/) |
| Intermediário | [Expedição Abissal](https://zyscaru.github.io/expedicao-abissal/) | [Missão Europa](https://zyscaru.github.io/missao-europa/) | [Ferrovia do Futuro](https://zyscaru.github.io/ferrovia-do-futuro/) | [Aeroporto Horizonte](https://zyscaru.github.io/aeroporto-horizonte/) |
| Avançado | [Protocolo Neon](https://zyscaru.github.io/protocolo-neon/) | [Forja Real](https://zyscaru.github.io/forja-real/) | [Estação Kepler](https://zyscaru.github.io/estacao-kepler/) | [Base Amazônia](https://zyscaru.github.io/base-amazonia/) |

Como todos os apps ficam no mesmo endereço (zyscaru.github.io), esta página consegue ler o progresso salvo por cada um no navegador.

## Organização do projeto

O portal mantém o visual existente com HTML, CSS e JavaScript em arquivos separados:

```text
index.html                 Estrutura da página inicial
assets/css/                Estilos do portal
assets/js/                 Interface, progresso, persistência e registro da PWA
assets/images/apps/        Ícones exibidos nos cartões
dados/apps.js              Catálogo de cursos e jogos
scripts/                   Verificação e servidor local
tests/                     Testes automatizados
docs/                      Contexto e arquitetura do projeto
sw.js                      Cache offline do portal
```

Cada app de JavaScript e SQL permanece em sua própria pasta, com seus arquivos e cache. Os códigos dos apps Python e Java referenciados no catálogo não estão neste repositório. O código interno dos oito apps ainda não foi separado; essa manutenção pode ser feita por app, preservando as atividades e o progresso.

## Executar e verificar

Use Node.js 24. Não é necessário instalar dependências ou gerar um build:

```powershell
npm run check
npm run preview
```

Se o ambiente tiver apenas o executável Node, os comandos equivalentes são `node scripts/check.mjs` e `node scripts/preview.mjs`. Para executar somente os testes, use `node --test tests/*.test.cjs`.

Abra `http://127.0.0.1:4173`. Encerre o servidor com `Ctrl+C`. O portal usa módulos JavaScript nativos; use a prévia HTTP em vez de abrir o HTML por `file://`.

`npm run check` verifica a estrutura e os links da documentação, além de executar os testes. `npm test` executa somente os testes. Eles verificam o cache offline, os recursos necessários ao portal e a preservação do progresso em armazenamento simulado. A validação em navegador real é complementar.

Ao adicionar ou mover um recurso usado pelo portal, inclua-o em `ARQUIVOS` no `sw.js` e avance sua versão. A publicação continua usando os arquivos da raiz, sem pasta `dist/`; a origem efetiva do GitHub Pages deve ser conferida antes de alterar a hospedagem.

## Documentação e manutenção

- [Contexto, arquitetura e branches](docs/codigo-em-jogo-contexto-e-branches.md): referência canônica para pessoas e assistentes.
- [Como contribuir](CONTRIBUTING.md): onde editar, como validar e como revisar/enviar alterações.
- [Instruções para assistentes](AGENTS.md): orientações de entrada para trabalhar no projeto.

Atualize esses documentos no mesmo PR que modificar a estrutura, os comandos ou os contratos de progresso e cache. A documentação acompanha o projeto no Git; não depende de uma cópia privada no computador.
