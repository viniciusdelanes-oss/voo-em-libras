
const container = document.getElementById('plans-container');

async function carregarCursos() {
  if (!container) return;

  container.innerHTML = '<p>Carregando nossos planos...</p>';

  const { data, error } = await supabaseClient
    .from('plans')
    .select('id, name, description')
    .eq('active', true)
    .order('name');

  if (error) {
    container.innerHTML = '<p>Não foi possível carregar os planos. Tente novamente mais tarde.</p>';
    console.error('Erro ao carregar planos:', error);
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = '<p>Nenhum plano disponível no momento.</p>';
    return;
  }

  const precos = {
    basico: { individual: 130, grupo: 95 },
    intermediario: { individual: 160, grupo: 110 },
    avancado: { individual: 190, grupo: 120 }
  };

  function identificarNivel(nome) {
    return String(nome || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  function escapar(valor) {
    return String(valor ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    })[c]);
  }

  function dinheiro(valor) {
    return Number(valor).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  container.innerHTML = data.map(plano => {
    const nome = identificarNivel(plano.name);

    let valores = null;
    let destaque = '';

    if (nome.includes('basico')) {
      valores = precos.basico;
    } else if (nome.includes('intermediario')) {
      valores = precos.intermediario;
      destaque = 'nivel-destaque';
    } else if (nome.includes('avancado') || nome.includes('completo')) {
      valores = precos.avancado;
    }

    if (!valores) {
      return `
        <article class="plan-card">
          <h3>${escapar(plano.name)}</h3>
          <p>Entre em contato para conhecer este nível.</p>
          <a href="planos.html" class="btn-primary">Ver matrícula</a>
        </article>
      `;
    }

    return `
      <article class="plan-card ${destaque}">
        <span class="plan-label">CURSO DE LIBRAS</span>

        <h3>${escapar(plano.name)}</h3>

        <p class="plan-description">
          ${escapar(plano.description || 'Aprenda Libras com aulas presenciais e materiais de apoio.')}
        </p>

        <div class="plan-feature">
          <span>✦ Aulas presenciais</span>
          <span>✦ Materiais de apoio</span>
          <span>✦ Aprendizado por níveis</span>
        </div>

        <div class="plan-price-box">
          <span>Aula individual</span>
          <strong>${dinheiro(valores.individual)}</strong>
          <small>por mês</small>
        </div>

        <div class="plan-group-price">
          <span>Aula em grupo</span>
          <strong>${dinheiro(valores.grupo)}</strong>
          <small>por aluno / mês</small>
        </div>

        <a href="planos.html" class="btn-primary plan-button">
          Ver opções de matrícula
        </a>
      </article>
    `;
  }).join('');
}

carregarCursos();
