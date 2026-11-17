
async function carregarSolicitacoes() {
  const lista = document.getElementById('lista-solicitacoes');
  const status = document.getElementById('status-solicitacoes');

  if (!lista || !status) return;

  status.textContent = 'Carregando solicitações...';
  lista.innerHTML = '';

  const { data, error } = await supabaseClient.rpc(
    'list_admin_plan_requests'
  );

  if (error) {
    status.textContent = 'Erro ao carregar: ' + error.message;
    return;
  }

  if (!data || data.length === 0) {
    status.textContent = 'Nenhuma solicitação encontrada.';
    return;
  }

  status.textContent = data.length + ' solicitação(ões) encontrada(s).';

  data.forEach(pedido => {
    const cartao = document.createElement('article');
    cartao.className = 'item';

    const titulo = document.createElement('h3');
    titulo.textContent = pedido.plano;

    const email = document.createElement('p');
    email.textContent = 'Aluno: ' + pedido.aluno_email;

    const valor = document.createElement('p');
    valor.textContent = 'Valor: R$ ' +
      (Number(pedido.price_cents || 0) / 100)
        .toFixed(2).replace('.', ',');

    const situacao = document.createElement('p');
    situacao.textContent = 'Situação: ' + pedido.status;

    const dataPedido = document.createElement('p');
    dataPedido.textContent = 'Solicitado em: ' +
      new Date(pedido.created_at).toLocaleString('pt-BR');

    cartao.append(titulo, email, valor, situacao, dataPedido);
    lista.appendChild(cartao);
  });
}

window.carregarSolicitacoes = carregarSolicitacoes;
