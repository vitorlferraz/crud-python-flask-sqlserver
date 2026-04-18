from flask import Flask, jsonify, request,render_template
import pyodbc

app = Flask(__name__)

# conexão com SQL Server
conn = pyodbc.connect(
    'DRIVER={SQL Server};SERVER=DESKTOP-CURR09I\\SQLEXPRESS;DATABASE=crude_teste;Trusted_Connection=yes;'
)

# 🔹 GET - listar clientes
@app.route('/clientes', methods=['GET'])
def get_clientes():
    cursor = conn.cursor()
    cursor.execute("SELECT id, nome, email FROM clientes")

    clientes = []
    for row in cursor.fetchall():
        clientes.append({
            "id": row.id,
            "nome": row.nome,
            "email": row.email
        })

    return jsonify(clientes)


# 🔹 POST - criar cliente
@app.route('/clientes', methods=['POST'])
def criar_cliente(): 
    dados = request.json

    nome = dados.get('nome')
    email = dados.get('email')

    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO clientes (nome, email) VALUES (?, ?)",
        (nome, email)
    )
    conn.commit()

    return jsonify({"mensagem": "Cliente criado com sucesso"})


# 🔹 PUT - atualizar cliente
@app.route('/clientes/<int:id>', methods=['PUT'])
def atualizar_cliente(id):
    dados = request.json

    nome = dados.get('nome')
    email = dados.get('email')

    cursor = conn.cursor()
    cursor.execute(
        "UPDATE clientes SET nome=?, email=? WHERE id=?",
        (nome, email, id)
    )
    conn.commit()

    return jsonify({"mensagem": "Cliente atualizado com sucesso"})


# 🔹 DELETE - deletar cliente
@app.route('/clientes/<int:id>', methods=['DELETE'])
def deletar_cliente(id):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM clientes WHERE id=?", (id,))
    conn.commit()

    return jsonify({"mensagem": "Cliente deletado com sucesso"})


@app.route('/')
def home():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)