// Client-side Model - JSON data shape

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