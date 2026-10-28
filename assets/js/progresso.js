import { ler } from './storage.js';

export function progresso(app) {
  if (app.modo === 'licoes') {
    const feitas = (ler(app.prefixo + 'done', []) || []).length;
    return {
      feitas: Math.min(feitas, app.total),
      estrelas: 0,
      pct: Math.min(100, Math.round(feitas / app.total * 100)),
    };
  }

  const salvas = ler(app.prefixo + 'stars', {}) || {};
  const valores = Object.values(salvas).filter(numero => numero > 0);
  return {
    feitas: Math.min(valores.length, app.total),
    estrelas: valores.reduce((total, numero) => total + numero, 0),
    pct: Math.min(100, Math.round(valores.length / app.total * 100)),
  };
}
