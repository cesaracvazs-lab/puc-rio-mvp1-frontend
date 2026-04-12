// Frontend service - JSON HTTP calls

async function listarClientes() {
    const url = root_url + 'listar_clientes';

    try {
        const respostaApi = await fetch(url, { method: 'get' });
        const respostaListarClientes = await respostaApi.json();
        
        return listarClientesModel(respostaListarClientes.clientes);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function detalharCliente(id) {
    const url = root_url + 'detalhar_cliente?id=' + id;

    try {
        const respostaApi = await fetch(url, { method: 'get' });
        const respostaDetalharCliente = await respostaApi.json();
        return respostaDetalharCliente?.cliente || respostaDetalharCliente;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function excluirCliente(id) {
    const url = root_url + 'excluir_cliente?id=' + id;

    try {
        const respostaApi = await fetch(url, { method: 'delete' });
        const respostaDetalharCliente = await respostaApi.json();
        return respostaDetalharCliente;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function atualizarCliente(cliente) {
    const url = root_url + 'atualizar_cliente?id=' + cliente.id;

    try {
        const respostaApi = await fetch(url, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente)
        });
        const respostaAtualizarCliente = await respostaApi.json();
        return respostaAtualizarCliente;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function incluirCliente(cliente) {
    const url = root_url + 'incluir_cliente';

    try {
        const respostaApi = await fetch(url, {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                cpf: cliente.cpf,
                email: cliente.email,
                nome: cliente.nome,
                data_nascimento: cliente.data_nascimento
            })
        });

        const respostaIncluirCliente = await respostaApi.json();

        if (!respostaApi.ok) {
            const mensagemErro = respostaIncluirCliente?.error || respostaIncluirCliente?.message || 'Erro ao incluir cliente.';
            throw new Error(mensagemErro);
        }

        return respostaIncluirCliente;
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
}