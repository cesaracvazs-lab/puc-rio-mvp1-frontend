// Frontend service - JSON HTTP calls

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