// UI State & bindings

let linhaSelecionadaTabela = null;
let isTabelaExpandida = false;
let idClienteContextualizado = null;

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

    // adiciona eventListener para a linha criada
    linha.addEventListener('click', async () => {
        const card = document.getElementById("card-detalhes-cliente");
        alternarCorLinhaSelecionada(linha);
        linhaSelecionadaTabela = linha;

        if(card.style.display === "flex" && idClienteContextualizado === cliente.id) {
            card.style.display = "none";
        }
        else {
            await montarCardDetalhesCliente(cliente.id);
            card.style.display = "flex";
        }

        idClienteContextualizado = cliente.id;
    });

    listarClientesDto(cliente).forEach((valor, i) => {
        const celula = linha.insertCell(i);
        celula.textContent = valor;
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
    if (linhaSelecionadaTabela) {
        linhaSelecionadaTabela.style.backgroundColor = '';
    }
    linha.style.backgroundColor = 'rgba(20, 101, 200, 0.5)';
}