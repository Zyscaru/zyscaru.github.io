import { APPS, BASE, ICONES } from '../../dados/apps.js';
import { ler, gravar } from './storage.js';
import { progresso } from './progresso.js';

const NOMES = { python: 'Python', java: 'Java', javascript: 'JavaScript', sql: 'SQL' };
const TRILHAS = ['python', 'java', 'javascript', 'sql'];
const RESUMO = {
  python: 'A linguagem mais usada para começar: leitura fácil, ótima para automação, dados e inteligência artificial.',
  java: 'Muito pedida em vagas: tipos, classes e coleções, a base de sistemas grandes e do Android.',
  javascript: 'A linguagem da web: roda em todo navegador e dá vida a sites, apps e servidores.',
  sql: 'A linguagem dos bancos de dados: pede, cruza e resume informações em qualquer empresa, app ou planilha.',
};

function esc(texto) {
  const entidades = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(texto).replace(/[&<>"']/g, caractere => entidades[caractere]);
}

function url(app) {
  return BASE + app.id + '/';
}

function renderContinuar(ultimo, progressos) {
  const continuar = document.getElementById('continuar');
  if (ultimo) {
    const p = progressos[ultimo.id];
    continuar.href = url(ultimo);
    continuar.innerHTML = `<img src="${ICONES[ultimo.id]}" alt=""><div><span class="t">Continuar de onde parou</span><b>${esc(ultimo.nome)}</b><span class="num">${p.feitas} de ${ultimo.total} ${ultimo.modo === 'licoes' ? 'lições' : 'missões'}</span></div><span class="seta">→</span>`;
    continuar.onclick = () => gravar('cg:ultimo', ultimo.id);
  } else {
    continuar.href = url(APPS[0]);
    continuar.innerHTML = `<img src="${ICONES['caderno-python']}" alt=""><div><span class="t">Nunca programou?</span><b>Comece pelo Caderno de Python</b><span class="num">71 lições, do zero</span></div><span class="seta">→</span>`;
    continuar.onclick = () => gravar('cg:ultimo', 'caderno-python');
  }
}

function renderTotais(progressos) {
  const jogos = APPS.filter(app => app.modo === 'estrelas');
  const cursos = APPS.filter(app => app.modo === 'licoes');
  const estrelas = APPS.reduce((total, app) => total + progressos[app.id].estrelas, 0);
  const maxEstrelas = jogos.reduce((total, app) => total + app.total * 3, 0);
  const licoes = cursos.reduce((total, app) => total + progressos[app.id].feitas, 0);
  const maxLicoes = cursos.reduce((total, app) => total + app.total, 0);
  const missoes = jogos.reduce((total, app) => total + progressos[app.id].feitas, 0);
  const maxMissoes = jogos.reduce((total, app) => total + app.total, 0);

  document.getElementById('totais').innerHTML =
    `<span class="chip">Lições <b>${licoes}</b>/ ${maxLicoes}</span><span class="chip">Missões <b>${missoes}</b>/ ${maxMissoes}</span><span class="chip"><span class="st">★</span><b>${estrelas}</b>/ ${maxEstrelas}</span>`;
}

function renderCard(app, p) {
  const comecou = p.feitas > 0;
  const fim = p.feitas >= app.total;
  return `<li class="parada"><div class="marco"><img src="${ICONES[app.id]}" alt=""></div>
    <article class="card"><span class="nivel">${app.tipo} · ${app.nivel}</span><h3>${esc(app.nome)}</h3><p>${esc(app.desc)}</p>
      <div class="barra" role="progressbar" aria-label="Progresso em ${esc(app.nome)}" aria-valuenow="${p.pct}" aria-valuemin="0" aria-valuemax="100"><i style="--p:${p.pct}%"></i></div>
      <div class="linha"><span class="num"><b>${p.feitas}</b> de ${app.total} ${app.modo === 'licoes' ? 'lições' : 'missões'}${app.modo === 'estrelas' ? ` · <span class="st">★</span> <b>${p.estrelas}</b>` : ''}</span>
        ${fim ? '<span class="feito">✓ concluído</span>' : ''}
        <a class="btn ${comecou ? '' : 'sec'}" href="${url(app)}" data-app="${app.id}">${fim ? 'Revisitar' : comecou ? 'Continuar' : 'Começar'} →</a></div>
    </article></li>`;
}

function renderAbas(aba, progressos) {
  function percentual(trilha) {
    const apps = APPS.filter(app => app.trilha === trilha);
    return Math.round(apps.reduce((total, app) => total + progressos[app.id].pct, 0) / apps.length);
  }

  document.getElementById('abas').innerHTML = TRILHAS.map(trilha =>
    `<button class="aba ${trilha}" role="tab" id="aba-${trilha}" aria-controls="trilhas" aria-selected="${trilha === aba}" tabindex="${trilha === aba ? 0 : -1}" data-aba="${trilha}"><b>${NOMES[trilha]}</b><small>${percentual(trilha)}% concluído</small></button>`,
  ).join('');

  document.querySelectorAll('[data-aba]').forEach((botao, indice, botoes) => {
    botao.onclick = () => {
      gravar('cg:aba', botao.dataset.aba);
      render();
      document.getElementById('aba-' + botao.dataset.aba).focus();
    };
    botao.onkeydown = evento => {
      const direcao = evento.key === 'ArrowRight' ? 1 : evento.key === 'ArrowLeft' ? -1 : 0;
      if (direcao) {
        evento.preventDefault();
        botoes[(indice + direcao + botoes.length) % botoes.length].click();
      }
    };
  });
}

function render() {
  const progressos = Object.fromEntries(APPS.map(app => [app.id, progresso(app)]));
  const ultimo = APPS.find(app => app.id === ler('cg:ultimo', null));
  let aba = ler('cg:aba', null);
  if (!TRILHAS.includes(aba)) aba = (ultimo && ultimo.trilha) || 'python';

  renderTotais(progressos);
  renderContinuar(ultimo, progressos);
  renderAbas(aba, progressos);

  const painel = document.getElementById('trilhas');
  painel.setAttribute('aria-labelledby', 'aba-' + aba);
  painel.innerHTML = `<section class="trilha ${aba}"><header><p>${RESUMO[aba]} Um curso do zero e três jogos que sobem de nível.</p></header>
    <ol class="paradas">${APPS.filter(app => app.trilha === aba).map(app => renderCard(app, progressos[app.id])).join('')}</ol></section>`;

  document.querySelectorAll('[data-app]').forEach(link => {
    link.addEventListener('click', () => gravar('cg:ultimo', link.dataset.app));
  });
}

export function iniciarPortal() {
  render();
  window.addEventListener('pageshow', render);
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) render();
  });
}
