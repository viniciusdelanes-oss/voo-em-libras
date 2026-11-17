
const container = document.getElementById('plans-container');

async function carregarCursos() {
  if (!container) return;

  container.innerHTML = '<p>Carregando planos...</p>';

  const { data, error } = await supabaseClient
    .from('plans')
    .select('id, name, description')
    .eq('active', true)
    .order('name');

  if (error) {
    container.innerHTML =
      '<p>Não foi possível carregar os planos. Tente novamente mais tarde.</p>';
    console.error('Erro ao carregar planos:', error);
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Nenhum plano disponível no momento.</p>';
    return;
  }

  container.innerHTML = data.map(plano => `
    <article style="
      background:white;
      padding:25px;
      border-radius:15px;
      box-shadow:0 4px 18px #00000012;
      text-align:center;
    ">
      <h3 style="color:#3157a4;">${escaparTexto(plano.name)}</h3>

      <p>${escaparTexto(
        plano.description || 'Curso de Libras com aulas presenciais e materiais de apoio.'
      )}</p>

      <a href="planos.html" style="
        display:inline-block;
        margin-top:15px;
        padding:12px 22px;
        background:#3157a4;
        color:white;
        text-decoration:none;
        border-radius:8px;
      ">
        Ver opções de matrícula
      </a>
    </article>
  `).join('');
}

function escaparTexto(valor) {
  return String(valor ?? '').replace(/[&<>"']/g, caractere => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[caractere]);
}

carregarCursos();
