// UI State & bindings

let isTabelaExpandida = false;
let isCardDetalhesVisivel = false;
let isCardEdicaoVisivel = false;

let linhaSelecionadaTabela = null;
let idClienteContextualizado = null;
let detalhesClienteContextualizado = null;

const COR_LINHA_CLIENTE_CONTEXTUALIZADO = 'rgba(20, 101, 200, 0.5)';

async function montarTabelaListaClientes() {
    const listaClientes = await listarClientes();
    if (!Array.isArray(listaClientes)) return;

    listaClientes.forEach((cliente) => {
        adicionarLinhaTabelaClientes(cliente);
    });

    isTabelaExpandida = true;
}

async function adicionarOpcoesAssinatura() {
    const selecao = document.getElementById("selecao-assinaturas");
    const listaAssinaturas = await listarAssinaturas();

    while (selecao.length > 1) {
        selecao.remove(1);
    }

    for(const assinatura of listaAssinaturas) {
        const option = document.createElement('option');
        option.value = assinatura.id;
        option.textContent = assinatura.nome;
        selecao.add(option);
    }
}

function adicionarLinhaTabelaClientes(cliente) {
    const tabela = document.getElementById('tabela-clientes');
    const linha = tabela.insertRow(-1);
    linha.id = cliente.id;

    linha.addEventListener('click', async () => {
        const cardDetalhesCliente = document.getElementById("card-detalhes-cliente");
        const cardEdicaoCliente = document.getElementById("card-edicao-cliente");
        const linhaFoiSelecionada = alternarCorLinhaSelecionada(linha);

        if (!linhaFoiSelecionada) {
            cardDetalhesCliente.style.display = "none";
            isCardDetalhesVisivel = false;
            
            cardEdicaoCliente.style.display = "none";
            isCardEdicaoVisivel = false;

            idClienteContextualizado = null;
            detalhesClienteContextualizado = null;
            return;
        }

        await montarCardDetalhesCliente(cliente.id);

        cardEdicaoCliente.style.display = "none";
        isCardEdicaoVisivel = false;
    
        cardDetalhesCliente.style.display = "flex";
        isCardDetalhesVisivel = true;

        idClienteContextualizado = cliente.id;
    });

    [cliente.id, cliente.nome, cliente.assinatura_id, cliente.estado_assinatura].forEach((valor, i) => {
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
    document.getElementById('detalhes-cliente-estado-assinatura').textContent = cliente.estado_assinatura ?? '-';
    document.getElementById('detalhes-cliente-ultima-atualizacao').textContent = cliente.ultima_atualizacao_assinatura ?? '-';
    document.getElementById('detalhes-cliente-data-vigencia').textContent = cliente.data_vigencia_assinatura ?? '-';
}

async function montarCardEdicaoClienteContextualizado() {
    adicionarOpcoesAssinatura();
    alternarCardsDetalheEdicao();
    
    const cliente = detalhesClienteContextualizado;
    if (!cliente) return;

    // Campos fixos (read-only)
    document.getElementById('edicao-cliente-id').textContent = cliente.id ?? '-';
    document.getElementById('edicao-cliente-cpf').textContent = cliente.cpf ?? '-';
    document.getElementById('edicao-cliente-data-cadastro').textContent = cliente.data_cadastro ?? '-';
    document.getElementById('edicao-cliente-estado-assinatura').textContent = cliente.estado_assinatura ?? '-';
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
    const cardDetalhesCliente = document.getElementById("card-detalhes-cliente");
    const tabelaClientes = document.getElementById("tabela-clientes");
    const linha = tabelaClientes.rows.namedItem(String(idClienteContextualizado));

    if(!confirm("Excluir Você tem certeza, amigão? id = " + idClienteContextualizado)) {
        return;
    }
    
    await excluirCliente(idClienteContextualizado);

    cardDetalhesCliente.style.display = "none";
    isCardDetalhesVisivel = false;

    excluirLinhaTabela(linha);
    idClienteContextualizado = null;
    detalhesClienteContextualizado = null;
}

async function editarClienteContextualizado() {
    await montarCardEdicaoClienteContextualizado();
    alternarCardsDetalheEdicao();
}

async function salvarEdicaoCliente() {
    const clienteAtualizado = montarRequisicaoCardEdicao();
    await atualizarCliente(clienteAtualizado);

    await montarCardDetalhesCliente(idClienteContextualizado);
    atualizarLinhaTabelaClienteContextualizado();
    alternarCardsDetalheEdicao();
}

function atualizarLinhaTabelaClienteContextualizado() {
    if (!idClienteContextualizado || !detalhesClienteContextualizado) return;

    const tabelaClientes = document.getElementById("tabela-clientes");
    const linha = tabelaClientes.rows.namedItem(String(idClienteContextualizado));
    if (!linha || linha.cells.length < 4) return;

    linha.cells[0].textContent = detalhesClienteContextualizado.id ?? '-';
    linha.cells[1].textContent = detalhesClienteContextualizado.nome ?? '-';
    linha.cells[2].textContent = detalhesClienteContextualizado.assinatura_id ?? '-';
    linha.cells[3].textContent = detalhesClienteContextualizado.estado_assinatura ?? '-';
}

function excluirLinhaTabela(linha) {
    if (!linha) return;

    if (linhaSelecionadaTabela === linha) {
        linhaSelecionadaTabela = null;
    }

    linha.remove();
}

function alternarCardsDetalheEdicao() {
    const cardEdicaoCliente = document.getElementById("card-edicao-cliente");
    const cardDetalhesCliente = document.getElementById("card-detalhes-cliente");
    
    if(!isCardDetalhesVisivel) {
        cardDetalhesCliente.style.display = "flex";
        isCardDetalhesVisivel = true;

        cardEdicaoCliente.style.display = "none";
        isCardEdicaoVisivel = false;
    }
    else {
        cardDetalhesCliente.style.display = "none";
        isCardDetalhesVisivel = false;
        
        cardEdicaoCliente.style.display = "flex";
        isCardEdicaoVisivel = true;

    }
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