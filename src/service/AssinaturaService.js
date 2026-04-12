async function listarAssinaturas() {
    const url = root_url + 'listar_assinaturas';

    try {
        const respostaApi = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        const respostaListarAssinaturas = await respostaApi.json();
        
        return listarAssinaturasModel(respostaListarAssinaturas.assinaturas);
    } catch (error) {
        console.error('Error:', error);
    }
}

async function detalharAssinatura(id) {
    const url = root_url + 'detalhar_assinatura?id=' + id;

    try {
        const respostaApi = await fetch(url, {
            method: 'GET',
            headers: { 'Accept': 'application/json' }
        });
        const respostaDetalharAssinatura = await respostaApi.json();
        return detalharAssinaturaModel(respostaDetalharAssinatura);
    } catch (error) {
        console.error('Error:', error);
    }
}