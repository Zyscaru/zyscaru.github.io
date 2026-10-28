// Catálogo exibido no portal. Preserve IDs e prefixos para manter o progresso.
export const BASE = "/";

export const APPS = [
  {
    "id": "caderno-python",
    "trilha": "python",
    "nivel": "Do zero",
    "tipo": "Curso",
    "nome": "Caderno de Python",
    "desc": "Lições curtas, exercícios corrigidos na hora, desafios e projetos para começar sem saber nada.",
    "prefixo": "cp:",
    "modo": "licoes",
    "total": 71
  },
  {
    "id": "robo-py",
    "trilha": "python",
    "nivel": "Iniciante",
    "tipo": "Jogo",
    "nome": "Robô Py",
    "desc": "Programe um robô em labirintos: comandos, laços, condições e funções.",
    "prefixo": "rp:",
    "modo": "estrelas",
    "total": 19
  },
  {
    "id": "expedicao-abissal",
    "trilha": "python",
    "nivel": "Intermediário",
    "tipo": "Jogo",
    "nome": "Expedição Abissal",
    "desc": "Um submarino no fundo do mar: dicionários, classes, exceções, geradores e busca em largura.",
    "prefixo": "ab:",
    "modo": "estrelas",
    "total": 18
  },
  {
    "id": "protocolo-neon",
    "trilha": "python",
    "nivel": "Avançado",
    "tipo": "Jogo",
    "nome": "Protocolo Neon",
    "desc": "Invasão numa cidade cyberpunk com closures, decoradores, metaprogramação e Dijkstra.",
    "prefixo": "pn:",
    "modo": "estrelas",
    "total": 18
  },
  {
    "id": "caderno-java",
    "trilha": "java",
    "nivel": "Do zero",
    "tipo": "Curso",
    "nome": "Caderno de Java",
    "desc": "Do primeiro println a classes e coleções, com exercícios corrigidos na hora.",
    "prefixo": "cj:",
    "modo": "licoes",
    "total": 68
  },
  {
    "id": "rover-marte",
    "trilha": "java",
    "nivel": "Iniciante",
    "tipo": "Jogo",
    "nome": "Rover em Marte",
    "desc": "Guie um rover entre rochas e cristais: variáveis, if, laços e métodos.",
    "prefixo": "rm:",
    "modo": "estrelas",
    "total": 19
  },
  {
    "id": "missao-europa",
    "trilha": "java",
    "nivel": "Intermediário",
    "tipo": "Jogo",
    "nome": "Missão Europa",
    "desc": "Sondas na lua gelada de Júpiter: interfaces, coleções, exceções e recursão.",
    "prefixo": "eu:",
    "modo": "estrelas",
    "total": 17
  },
  {
    "id": "forja-real",
    "trilha": "java",
    "nivel": "Avançado",
    "tipo": "Jogo",
    "nome": "Forja Real",
    "desc": "Golens num reino medieval: genéricos, records, streams, pattern matching e algoritmos.",
    "prefixo": "fr:",
    "modo": "estrelas",
    "total": 18
  },
  {
    "id": "caderno-javascript",
    "trilha": "javascript",
    "nivel": "Do zero",
    "tipo": "Curso",
    "nome": "Caderno de JavaScript",
    "desc": "Do primeiro console.log a classes, métodos de array e código assíncrono, com exercícios corrigidos na hora.",
    "prefixo": "cjs:",
    "modo": "licoes",
    "total": 73
  },
  {
    "id": "voo-da-abelha",
    "trilha": "javascript",
    "nivel": "Iniciante",
    "tipo": "Jogo",
    "nome": "Voo da Abelha",
    "desc": "Guie a abelha Zuzu pelo jardim: comandos, for, funções, if, while e variáveis.",
    "prefixo": "va:",
    "modo": "estrelas",
    "total": 19
  },
  {
    "id": "ferrovia-do-futuro",
    "trilha": "javascript",
    "nivel": "Intermediário",
    "tipo": "Jogo",
    "nome": "Ferrovia do Futuro",
    "desc": "Trens maglev numa cidade: objetos, classes, closures, Promises e busca em largura.",
    "prefixo": "ff:",
    "modo": "estrelas",
    "total": 18
  },
  {
    "id": "estacao-kepler",
    "trilha": "javascript",
    "nivel": "Avançado",
    "tipo": "Jogo",
    "nome": "Estação Kepler",
    "desc": "Uma estação espacial: geradores, campos privados, async avançado, Proxy, heap e Dijkstra.",
    "prefixo": "ek:",
    "modo": "estrelas",
    "total": 18
  },
  {
    "id": "caderno-sql",
    "trilha": "sql",
    "nivel": "Do zero",
    "tipo": "Curso",
    "nome": "Caderno de SQL",
    "desc": "Do primeiro SELECT a JOIN, subconsultas e funções de janela, com consultas corrigidas na hora num banco de verdade.",
    "prefixo": "csql:",
    "modo": "licoes",
    "total": 67
  },
  {
    "id": "misterio-no-museu",
    "trilha": "sql",
    "nivel": "Iniciante",
    "tipo": "Jogo",
    "nome": "Mistério no Museu",
    "desc": "Descubra quem levou a Coroa de Esmeraldas: SELECT, WHERE, LIKE, NULL, COUNT e GROUP BY.",
    "prefixo": "mm:",
    "modo": "estrelas",
    "total": 18
  },
  {
    "id": "aeroporto-horizonte",
    "trilha": "sql",
    "nivel": "Intermediário",
    "tipo": "Jogo",
    "nome": "Aeroporto Horizonte",
    "desc": "Opere um aeroporto: JOIN, LEFT JOIN, subconsultas, CASE, UPDATE e transações.",
    "prefixo": "ah:",
    "modo": "estrelas",
    "total": 18
  },
  {
    "id": "base-amazonia",
    "trilha": "sql",
    "nivel": "Avançado",
    "tipo": "Jogo",
    "nome": "Base Amazônia",
    "desc": "Monitore rios: funções de janela, CTE recursiva, JSON, gatilhos e índices.",
    "prefixo": "ba:",
    "modo": "estrelas",
    "total": 18
  }
];

export const ICONES = Object.fromEntries(
  APPS.map(app => [app.id, `assets/images/apps/${app.id}.png`]),
);
