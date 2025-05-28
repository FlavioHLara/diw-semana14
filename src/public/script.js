const API_URL = 'http://localhost:3000/produtos';

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('produto-form')) {
        carregarProdutos();

        document.getElementById('produto-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('produto-id').value;
            const nome = document.getElementById('nome').value;
            const descricao = document.getElementById('descricao').value;
            const preco = parseFloat(document.getElementById('preco').value);

            const produto = { nome, descricao, preco };

            if (id) {
                await fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(produto)
                });
            } else {
                await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(produto)
                });
            }

            document.getElementById('produto-form').reset();
            document.getElementById('produto-id').value = '';
            carregarProdutos();
        });
    }
});

async function carregarProdutos() {
    const resposta = await fetch(API_URL);
    const produtos = await resposta.json();

    const tbody = document.getElementById('produtos-tbody');
    tbody.innerHTML = '';

    produtos.forEach(p => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.descricao}</td>
      <td>${p.preco}</td>
      <td>
        <button onclick="editarProduto(${p.id})">Editar</button>
        <button onclick="deletarProduto(${p.id})">Excluir</button>
      </td>
    `;
        tbody.appendChild(tr);
    });
}

async function editarProduto(id) {
    const resp = await fetch(`${API_URL}/${id}`);
    const p = await resp.json();

    document.getElementById('produto-id').value = p.id;
    document.getElementById('nome').value = p.nome;
    document.getElementById('descricao').value = p.descricao;
    document.getElementById('preco').value = p.preco;
}

async function deletarProduto(id) {
    if (confirm("Tem certeza que deseja excluir?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        carregarProdutos();
    }
}