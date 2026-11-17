
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

    if (pedido.status === 'pending') {
      const botao = document.createElement('button');
      botao.textContent = 'Confirmar pagamento';
      botao.className = 'btn-primary';

      botao.onclick = async () => {
        if (!confirm('Confirma que recebeu o Pix deste aluno?')) return;

        botao.disabled = true;
        botao.textContent = 'Processando...';

        const { data, error } = await supabaseClient.rpc(
          'confirmar_pagamento_plano',
          { p_request_id: pedido.id }
        );

        if (error) {
          alert('Erro: ' + error.message);
          botao.disabled = false;
          botao.textContent = 'Confirmar pagamento';
          return;
        }

        alert(data);
        carregarSolicitacoes();
      };

      cartao.appendChild(botao);
    }

    lista.appendChild(cartao);
  });
}

window.carregarSolicitacoes = carregarSolicitacoes;
