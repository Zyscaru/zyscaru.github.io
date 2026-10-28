// Os prefixos são contratos com os apps. Não use localStorage.clear().
export function ler(chave, padrao) {
  try {
    const valor = localStorage.getItem(chave);
    return valor === null ? padrao : JSON.parse(valor);
  } catch {
    return padrao;
  }
}

export function gravar(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    // O portal continua utilizável quando o navegador bloqueia a persistência.
  }
}
