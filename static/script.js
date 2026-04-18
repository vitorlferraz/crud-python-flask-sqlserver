const api = "http://localhost:5000/clientes";

let clienteEditando = null;

// 🔹 listar
function carregarClientes() {
    fetch(api)
        .then(res => res.json())
        .then(data => {
            const lista = document.getElementById("lista");
            lista.innerHTML = "";

            data.forEach(cliente => {
                const li = document.createElement("li");
                li.innerHTML = `
                    ${cliente.nome} - ${cliente.email}
                    <button onclick="editar(${cliente.id}, '${cliente.nome}', '${cliente.email}')">Editar</button>
                    <button onclick="deletar(${cliente.id})">Excluir</button>
                `;
                lista.appendChild(li);
            });
        });
}

// 🔹 criar ou atualizar
function salvarCliente() {
    console.log("clicou salvar");
    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;

    if (!nome || !email) {
        alert("Preencha todos os campos!");
        return;
    }

    if (clienteEditando) {
        // UPDATE
        fetch(`${api}/${clienteEditando}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email })
        }).then(() => {
            mostrarMensagem("Cliente atualizado!");
            clienteEditando = null;
            limparCampos();
            carregarClientes();
        });
    } else {
        // CREATE
        fetch(api, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email })
        }).then(() => {
            mostrarMensagem("Cliente criado com sucesso!");
            limparCampos();
            carregarClientes();
        });
    }
}

// 🔹 preencher para edição
function editar(id, nome, email) {
    clienteEditando = id;
    document.getElementById("nome").value = nome;
    document.getElementById("email").value = email;
}

// 🔹 deletar
function deletar(id) {
    if (!confirm("Deseja excluir esse cliente?")) return;

    fetch(`${api}/${id}`, {
        method: "DELETE"
    }).then(() => {
    mostrarMensagem("Cliente deletado!");
    carregarClientes();
})};

// 🔹 limpar
function limparCampos() {
    document.getElementById("nome").value = "";
    document.getElementById("email").value = "";
}

function mostrarMensagem(texto) {
    const msg = document.getElementById("msg");
    msg.innerText = texto;

    setTimeout(() => {
        msg.innerText = "";
    }, 2000);
}

// carregar ao abrir
carregarClientes();