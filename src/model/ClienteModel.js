let linhaSelecionada = null;

async function listarClientes() {
    const url = root_url + 'listar_clientes';

    try {
        const respostaApi = await fetch(url, { method: 'get' });
        const respostaListarClientes = await respostaApi.json();
        
        return respostaListarClientes;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function detalharCliente(id) {
    const url = root_url + 'detalhar_cliente?id=' + id;

    try {
        const respostaApi = await fetch(url, { method: 'get' });
        const respostaDetalharCliente = await respostaApi.json();
        return respostaDetalharCliente;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function montarTabelaClientes() {
    const respostaListarClientes = await listarClientes();
    if (!respostaListarClientes || !Array.isArray(respostaListarClientes.clientes)) return;

    const tabela = document.getElementById('tabela-clientes');

    while (tabela.rows.length > 1) {
        tabela.deleteRow(1);
    }

    respostaListarClientes.clientes.forEach((cliente) => {
        inserirLinhaTabelaClientes(cliente);
    });
}

async function montarCardDetalhesCliente(id) {
    const resposta = await detalharCliente(id);
    const cliente = resposta?.cliente || resposta;

    if (!cliente) return;

    document.getElementById('cliente-id').textContent = cliente.id ?? '-';
    document.getElementById('cliente-cpf').textContent = cliente.cpf ?? '-';
    document.getElementById('cliente-nome').textContent = cliente.nome ?? '-';
    document.getElementById('cliente-email').textContent = cliente.email ?? '-';
    document.getElementById('cliente-data-nascimento').textContent = cliente.data_nascimento ?? '-';
    document.getElementById('cliente-data-cadastro').textContent = cliente.data_cadastro ?? '-';
    document.getElementById('cliente-assinatura-id').textContent = cliente.assinatura_id ?? '-';
    document.getElementById('cliente-estado-assinatura').textContent = cliente.estado_assinatura ?? '-';
    document.getElementById('cliente-ultima-atualizacao').textContent = cliente.ultima_atualizacao_assinatura ?? '-';
    document.getElementById('cliente-data-vigencia').textContent = cliente.data_vigencia_assinatura ?? '-';
}

function inserirLinhaTabelaClientes(cliente) {
    const tabela = document.getElementById('tabela-clientes');
    const linha = tabela.insertRow(-1);

    linha.addEventListener('click', async () => {
        alternarCorLinhaSelecionada(linha);
        linhaSelecionada = linha;

        await montarCardDetalhesCliente(cliente.id);
    });

    listarClientesDto(cliente).forEach((valor, i) => {
        const celula = linha.insertCell(i);
        celula.textContent = valor;
    });
}

function listarClientesDto(cliente) {
    return [
        cliente.id,
        cliente.nome,
        cliente.assinatura_id,
        cliente.estado_assinatura
    ]
}

function detalharClientesDto(cliente) {
    return [
        cliente.id,
        cliente.cpf,
        cliente.nome,
        cliente.email,
        cliente.data_nascimento,
        cliente.data_cadastro,
        cliente.assinatura_id,
        cliente.estado_assinatura,
        cliente.ultima_atualizacao_assinatura,
        cliente.data_vigencia_assinatura
    ]
}

function alternarCorLinhaSelecionada(linha) {
    if (linhaSelecionada) {
        linhaSelecionada.style.backgroundColor = '';
    }
    linha.style.backgroundColor = 'rgba(20, 101, 200, 0.5)';
}