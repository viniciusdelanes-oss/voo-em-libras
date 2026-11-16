
async function carregarPlanos() {
  const container = document.getElementById('plans-container');

  if (!container) return;

  const { data: planos, error } = await supabaseClient
    .from('plans')
    .select('id, name, description, price_cents, features')
    .eq('active', true)
    .order('sort_order');

  if (error) {
    console.error('Erro ao carregar planos:', error);
    container.innerHTML = '<p>Não foi possível carregar os planos.</p>';
    return;
  }

  if (!planos || planos.length === 0) {
    container.innerHTML = '<p>Nenhum plano disponível no momento.</p>';
    return;
  }

  container.innerHTML = planos.map(plano => {
    const recursos = Array.isArray(plano.features)
      ? plano.features
      : [];

    const lista = recursos
      .map(item => `<li>${escaparHTML(item)}</li>`)
      .join('');

    return `
      <article class="plan-card">
        <h3>${escaparHTML(plano.name)}</h3>
        <p>${escaparHTML(plano.description || '')}</p>
        <strong>
          ${plano.price_cents > 0
            ? formatarMoeda(plano.price_cents) + ' / mês'
            : 'Preço em breve'}
        </strong>
        <ul>${lista}</ul>
        <a class="btn-primary" href="login.html">
          Tenho interesse
        </a>
      </article>
    `;
  }).join('');
}

function escaparHTML(valor) {
  return String(valor).replace(/[&<>"']/g, caractere => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[caractere]);
}

function formatarMoeda(centavos) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(centavos / 100);
}

document.addEventListener('DOMContentLoaded', carregarPlanos);
