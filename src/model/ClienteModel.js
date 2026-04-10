/*
  --------------------------------------------------------------------------------------
  Função que lista os clientes cadastrados no banco de dados via requisição GET
  --------------------------------------------------------------------------------------
*/
const listarClientes = async () => {
    let url = root_url + 'listar_clientes';
    fetch(url, { method: 'get' })
        .then((resposta) => resposta.json())
        .then((dados) => {
            const table = document.getElementById('tabela-clientes');
            while (table.rows.length > 1) table.deleteRow(1);
            dados.clientes.forEach((cliente) => {
                inserirLinhaCliente(cliente);
            });
        })
        .catch((error) => {
            console.error('Error:', error);
        }
    );
}

const inserirLinhaCliente = (cliente) => {
    const tabela = document.getElementById('tabela-clientes');
    const linha = tabela.insertRow(-1);
    
    listarClientesDto(cliente).forEach((valor, i) => {
        const celula = linha.insertCell(i);
        celula.textContent = valor;
    });
};

// TODO validar cliente?
function listarClientesDto(cliente) {
    return [
        cliente.id,
        cliente.nome,
        cliente.assinatura_id,
        cliente.estado_assinatura
    ]
}