// UI State & bindings

let linhaSelecionadaTabela = null;
let isTabelaExpandida = false;
let idClienteContextualizado = null;
const COR_LINHA_CLIENTE_CONTEXTUALIZADO = 'rgba(20, 101, 200, 0.5)';

async function montarTabelaListaClientes() {
    const respostaListarClientes = await listarClientes();
    if (!respostaListarClientes || !Array.isArray(respostaListarClientes.clientes)) return;

    respostaListarClientes.clientes.forEach((cliente) => {
        adicionarLinhaTabelaClientes(cliente);
    });

    isTabelaExpandida = true;
}

function adicionarLinhaTabelaClientes(cliente) {
    const tabela = document.getElementById('tabela-clientes');
    const linha = tabela.insertRow(-1);
    linha.id = cliente.id;

    linha.addEventListener('click', async () => {
        const card = document.getElementById("card-detalhes-cliente");
        const linhaFoiSelecionada = alternarCorLinhaSelecionada(linha);

        if (!linhaFoiSelecionada) {
            card.style.display = "none";
            idClienteContextualizado = null;
            return;
        }

        await montarCardDetalhesCliente(cliente.id);
        card.style.display = "flex";
        idClienteContextualizado = cliente.id;
    });

    listarClientesDto(cliente).forEach((valor, i) => {
        const celula = linha.insertCell(i);
        celula.textContent = valor;
    });

    if (idClienteContextualizado === cliente.id) {
        linha.style.setProperty('background-color', COR_LINHA_CLIENTE_CONTEXTUALIZADO, 'important');
        linhaSelecionadaTabela = linha;
    }
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
    const card = document.getElementById("card-detalhes-cliente");
    const tabelaClientes = document.getElementById("tabela-clientes");
    const linha = tabelaClientes.rows.namedItem(String(idClienteContextualizado));

    if(confirm("Excluir Você tem certeza, amigão? id = " + idClienteContextualizado)) {
        await excluirCliente(idClienteContextualizado);

        card.style.display = "none";
        excluirLinhaTabela(linha);
        idClienteContextualizado = null;
    }
}

// TODO:
// recarregar tabela
/*
    1 esconder Card detalhar-cliente
    2 mostrar Card editar-cliente
    3 clique em Salvar
    4 processar alterações
    se sucesso:
    5 esconder Card editar-cliente
    --- preciso atualizar card detalhar e linha da tabela? ---
    6 mostrar Card detalhar-cliente 
*/
async function editarClienteContextualizado() {
    if(confirm("Editar Você tem certeza, amigão? id = " + idClienteContextualizado)) {
    }
}

function excluirLinhaTabela(linha) {
    if (!linha) return;

    if (linhaSelecionadaTabela === linha) {
        linhaSelecionadaTabela = null;
    }

    linha.remove();
}