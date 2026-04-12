// Client-side Model - JSON data shape

function listarClientesModel(clientes) {
    return clientes.map((cliente) => ({
        id: cliente.id,
        nome: cliente.nome,
        assinatura_id: cliente.assinatura_id,
        estado_assinatura: cliente.estado_assinatura
    }));
}