// UI State & bindings

let isTabelaExpandida = false;
let isCardDetalhesVisivel = false;
let isCardEdicaoVisivel = false;
let isCardInclusaoVisivel = false;

let linhaSelecionadaTabela = null;
let idClienteContextualizado = null;
let detalhesClienteContextualizado = null;

const COR_LINHA_CLIENTE_CONTEXTUALIZADO = 'rgba(20, 101, 200, 0.5)';

async function montarTabelaListaClientes() {
    const listaClientes = await listarClientes();
    const listaAssinaturas = await listarAssinaturas();
    if (!Array.isArray(listaClientes)) return;

    listaClientes.forEach((cliente) => {
        adicionarLinhaTabelaClientes(cliente, listaAssinaturas);
    });

    isTabelaExpandida = true;
}

async function adicionarOpcoesAssinatura(clienteAtual) {
    const selecao = document.getElementById("selecao-assinaturas");
    const listaAssinaturas = await listarAssinaturas();
    const assinaturaAtualId = clienteAtual?.assinatura_id;

    while (selecao.length > 0) {
        selecao.remove(0);
    }

    if (assinaturaAtualId) {
        const assinaturaAtual = listaAssinaturas.find((assinatura) => assinatura.id == assinaturaAtualId);
        const optionAtual = document.createElement('option');
        optionAtual.value = assinaturaAtualId;
        optionAtual.textContent = assinaturaAtual?.nome ?? `Assinatura ${assinaturaAtualId}`;
        optionAtual.selected = true;
        selecao.add(optionAtual);
    }
    else {
        const optionPadrao = document.createElement('option');
        optionPadrao.value = '';
        optionPadrao.textContent = 'Selecione uma assinatura';
        optionPadrao.selected = true;
        selecao.add(optionPadrao);
    }

    for (const assinatura of listaAssinaturas) {
        if (assinatura.id == assinaturaAtualId) continue;
        const option = document.createElement('option');
        option.value = assinatura.id;
        option.textContent = assinatura.nome;
        selecao.add(option);
    }
}

function adicionarLinhaTabelaClientes(cliente, listaAssinaturas = []) {
    const tabela = document.getElementById('tabela-clientes');
    const linha = tabela.insertRow(-1);
    linha.id = cliente.id;
    const nomeAssinatura = obterNomeAssinatura(cliente.assinatura_id, listaAssinaturas);

    linha.addEventListener('click', async () => {
        const linhaFoiSelecionada = alternarCorLinhaSelecionada(linha);

        if (!linhaFoiSelecionada) {
            exibirApenasCard('nenhum');
            idClienteContextualizado = null;
            detalhesClienteContextualizado = null;
            return;
        }

        await montarCardDetalhesCliente(cliente.id);
        exibirApenasCard('detalhes');

        idClienteContextualizado = cliente.id;
    });

    [cliente.id, cliente.nome, nomeAssinatura, formatarEstadoAssinatura(cliente.estado_assinatura)].forEach((valor, i) => {
        const celula = linha.insertCell(i);
        celula.textContent = valor;
    });

    if (idClienteContextualizado === cliente.id) {
        linha.style.setProperty('background-color', COR_LINHA_CLIENTE_CONTEXTUALIZADO, 'important');
        linhaSelecionadaTabela = linha;
    }
}

async function montarCardDetalhesCliente(id) {
    const cliente = await detalharCliente(id);
    detalhesClienteContextualizado = cliente;

    if (!cliente) return;

    document.getElementById('detalhes-cliente-id').textContent = cliente.id ?? '-';
    document.getElementById('detalhes-cliente-cpf').textContent = cliente.cpf ?? '-';
    document.getElementById('detalhes-cliente-nome').textContent = cliente.nome ?? '-';
    document.getElementById('detalhes-cliente-email').textContent = cliente.email ?? '-';
    document.getElementById('detalhes-cliente-data-nascimento').textContent = cliente.data_nascimento ?? '-';
    document.getElementById('detalhes-cliente-data-cadastro').textContent = cliente.data_cadastro ?? '-';
    let nomeAssinatura = '-';
    if (cliente.assinatura_id) {
        const assinatura = await detalharAssinatura(cliente.assinatura_id);
        nomeAssinatura = assinatura?.nome ?? '-';
    }
    document.getElementById('detalhes-cliente-assinatura-nome').textContent = nomeAssinatura;
    document.getElementById('detalhes-cliente-estado-assinatura').textContent = formatarEstadoAssinatura(cliente.estado_assinatura);
    document.getElementById('detalhes-cliente-ultima-atualizacao').textContent = cliente.ultima_atualizacao_assinatura ?? '-';
    document.getElementById('detalhes-cliente-data-vigencia').textContent = cliente.data_vigencia_assinatura ?? '-';
}

async function montarCardEdicaoClienteContextualizado() {
    const cliente = detalhesClienteContextualizado;
    if (!cliente) return;

    await adicionarOpcoesAssinatura(cliente);
    exibirApenasCard('edicao');

    // Campos fixos (read-only)
    document.getElementById('edicao-cliente-id').textContent = cliente.id ?? '-';
    document.getElementById('edicao-cliente-cpf').textContent = cliente.cpf ?? '-';
    document.getElementById('edicao-cliente-data-cadastro').textContent = cliente.data_cadastro ?? '-';
    document.getElementById('edicao-cliente-estado-assinatura').textContent = formatarEstadoAssinatura(cliente.estado_assinatura);
    document.getElementById('edicao-cliente-ultima-atualizacao').textContent = cliente.ultima_atualizacao_assinatura ?? '-';
    document.getElementById('edicao-cliente-data-vigencia').textContent = cliente.data_vigencia_assinatura ?? '-';
    
    // Campos editáveis (inputs)
    document.getElementById('edicao-cliente-nome').value = cliente.nome ?? '';
    document.getElementById('edicao-cliente-email').value = cliente.email ?? '';
    document.getElementById('edicao-cliente-data-nascimento').value = cliente.data_nascimento ?? '';
    document.getElementById('selecao-assinaturas').value = cliente.assinatura_id ?? '';
}

// Funções auxiliares

async function alternarTabela(tabela) {
    if (isTabelaExpandida) {
        recolherTabela(tabela);
    }
    else {
        await montarTabelaListaClientes();
    }
}

function recolherTabela(tabela) {
    while (tabela.rows.length > 1) {
        tabela.deleteRow(1);
    }
    isTabelaExpandida = false;
}

function alternarCorLinhaSelecionada(linha) {
    if (linhaSelecionadaTabela === linha) {
        linhaSelecionadaTabela.style.removeProperty('background-color');
        linhaSelecionadaTabela = null;
        return false;
    }
    
    if (linhaSelecionadaTabela) {
        linhaSelecionadaTabela.style.removeProperty('background-color');
    }

    linha.style.setProperty('background-color', COR_LINHA_CLIENTE_CONTEXTUALIZADO, 'important');
    linhaSelecionadaTabela = linha;

    return true;
}

// botao
async function excluirClienteContextualizado() {
    const tabelaClientes = document.getElementById("tabela-clientes");
    const linha = tabelaClientes.rows.namedItem(String(idClienteContextualizado));

    if(!confirm("Deseja realmente excluir este Cliente? id = " + idClienteContextualizado)) {
        return;
    }
    
    await excluirCliente(idClienteContextualizado);
    exibirApenasCard('nenhum');

    excluirLinhaTabela(linha);
    idClienteContextualizado = null;
    detalhesClienteContextualizado = null;
}

async function editarClienteContextualizado() {
    await montarCardEdicaoClienteContextualizado();
}

async function salvarEdicaoCliente() {
    const clienteAtualizado = montarRequisicaoCardEdicao();
    await atualizarCliente(clienteAtualizado);

    await montarCardDetalhesCliente(idClienteContextualizado);
    await atualizarLinhaTabelaClienteContextualizado();
    exibirApenasCard('detalhes');
}

function montarCardInclusaoCliente() {
    limparContextoClienteSelecionado();
    limparCamposCardInclusao();
    exibirApenasCard('inclusao');
}

function cancelarInclusaoCliente() {
    if (idClienteContextualizado && detalhesClienteContextualizado) {
        exibirApenasCard('detalhes');
        return;
    }

    exibirApenasCard('nenhum');
}

async function salvarInclusaoCliente() {
    const cliente = montarRequisicaoCardInclusao();

    if (!cliente.cpf || !cliente.email || !cliente.nome || !cliente.data_nascimento) {
        alert('Preencha cpf, email, nome e data_nascimento.');
        return;
    }

    try {
        await incluirCliente(cliente);
        await recarregarTabelaClientes();
        limparCamposCardInclusao();
        exibirApenasCard('nenhum');
        alert('Cliente incluido com sucesso!');
    } catch (error) {
        alert(error?.message || 'Falha ao incluir cliente.');
    }
}

async function atualizarLinhaTabelaClienteContextualizado() {
    if (!idClienteContextualizado || !detalhesClienteContextualizado) return;

    const tabelaClientes = document.getElementById("tabela-clientes");
    const linha = tabelaClientes.rows.namedItem(String(idClienteContextualizado));
    if (!linha || linha.cells.length < 4) return;

    const listaAssinaturas = await listarAssinaturas();

    linha.cells[0].textContent = detalhesClienteContextualizado.id ?? '-';
    linha.cells[1].textContent = detalhesClienteContextualizado.nome ?? '-';
    linha.cells[2].textContent = obterNomeAssinatura(detalhesClienteContextualizado.assinatura_id, listaAssinaturas);
    linha.cells[3].textContent = formatarEstadoAssinatura(detalhesClienteContextualizado.estado_assinatura);
}

function excluirLinhaTabela(linha) {
    if (!linha) return;

    if (linhaSelecionadaTabela === linha) {
        linhaSelecionadaTabela = null;
    }

    linha.remove();
}

function alternarCardsDetalheEdicao() {
    if (isCardEdicaoVisivel) {
        exibirApenasCard('detalhes');
        return;
    }

    if (isCardDetalhesVisivel) {
        exibirApenasCard('edicao');
        return;
    }

    exibirApenasCard('nenhum');
}

function limparContextoClienteSelecionado() {
    if (linhaSelecionadaTabela) {
        linhaSelecionadaTabela.style.removeProperty('background-color');
        linhaSelecionadaTabela = null;
    }

    idClienteContextualizado = null;
    detalhesClienteContextualizado = null;
}

function exibirApenasCard(card) {
    const cardDetalhesCliente = document.getElementById('card-detalhes-cliente');
    const cardEdicaoCliente = document.getElementById('card-edicao-cliente');
    const cardInclusaoCliente = document.getElementById('card-inclusao-cliente');

    cardDetalhesCliente.style.display = card === 'detalhes' ? 'flex' : 'none';
    cardEdicaoCliente.style.display = card === 'edicao' ? 'flex' : 'none';
    cardInclusaoCliente.style.display = card === 'inclusao' ? 'flex' : 'none';

    isCardDetalhesVisivel = card === 'detalhes';
    isCardEdicaoVisivel = card === 'edicao';
    isCardInclusaoVisivel = card === 'inclusao';
}

function montarRequisicaoCardInclusao() {
    return {
        cpf: document.getElementById('inclusao-cliente-cpf').value.trim(),
        email: document.getElementById('inclusao-cliente-email').value.trim(),
        nome: document.getElementById('inclusao-cliente-nome').value.trim(),
        data_nascimento: document.getElementById('inclusao-cliente-data-nascimento').value.trim()
    };
}

function limparCamposCardInclusao() {
    document.getElementById('inclusao-cliente-cpf').value = '';
    document.getElementById('inclusao-cliente-email').value = '';
    document.getElementById('inclusao-cliente-nome').value = '';
    document.getElementById('inclusao-cliente-data-nascimento').value = '';
}

async function recarregarTabelaClientes() {
    const tabela = document.getElementById('tabela-clientes');
    recolherTabela(tabela);

    linhaSelecionadaTabela = null;
    idClienteContextualizado = null;
    detalhesClienteContextualizado = null;

    exibirApenasCard('nenhum');
    await montarTabelaListaClientes();
}

function montarRequisicaoCardEdicao() {
    return {
        id: idClienteContextualizado,
        nome: document.getElementById('edicao-cliente-nome').value,
        email: document.getElementById('edicao-cliente-email').value,
        data_nascimento: document.getElementById('edicao-cliente-data-nascimento').value,
        assinatura_id: document.getElementById('selecao-assinaturas').value || null
    };
}

function obterNomeAssinatura(assinaturaId, listaAssinaturas = []) {
    if (!assinaturaId) return '-';

    const assinatura = listaAssinaturas.find((item) => item.id == assinaturaId);
    return assinatura?.nome ?? '-';
}

function formatarEstadoAssinatura(estado) {
    if (estado === 1 || estado === '1') return 'Ativa';
    if (estado === 0 || estado === '0') return 'Inativa';
    return '-';
}