// Client-side Model - JSON data shape

function listarAssinaturasModel(assinaturas) {
    return assinaturas.map((assinatura) => ({
        id: assinatura.id,
        nome: assinatura.nome,
        valor_mensal: assinatura.valor_mensal
    }));
}

function detalharAssinaturaModel(assinatura) {
    return {
        id: assinatura.id,
        nome: assinatura.nome,
        valor_mensal: assinatura.valor_mensal,
        data_cadastro: assinatura.data_cadastro
    };
}