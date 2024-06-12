//simula um banco de dados em memória
var clientes = []

//guarda o objeto que está sendo alterado
var clienteAlterado = null

function adicionar() {
    //libera para digitar o CPF
    document.getElementById("cpf").disabled = false
    clienteAlterado = null
    mostrarModal()
    limparForm()
}
function alterar(cpf) {

    //procurar o cliente que tem o CPF clicado no alterar
    for (let i = 0; i < clientes.length; i++) {
        let cliente = clientes[i]
        if (cliente.cpf == cpf) {
            //achou o cliente, entao preenche o form
            document.getElementById("nome").value = cliente.nome
            document.getElementById("cpf").value = cliente.cpf
            document.getElementById("telefone").value = cliente.telefone

            document.getElementById("whatsapp").value = cliente.whatsapp
            document.getElementById("sexoCalopsita").value = cliente.sexoCalopsita

            clienteAlterado = cliente
        }
    }
    //bloquear o cpf para nao permitir alterá-lo
    document.getElementById("cpf").disabled = true
    mostrarModal()
}
function excluir(cpf) {
    if (confirm("Você deseja realmente excluir?")) {
        fetch("http://localhost:3000/excluir/" + cpf ,{
            headers: {
                "Content-type": "application/json"
            },
            method: "DELETE"
        }).then((response) =>{
            //após terminar de excluir, recarrega a lista de clientes
            recarregarClientes();
            alert("Cliente excluído com sucesso")
        }).catch((error) => {
            console.log(error)
            alert("Não foi possível excluir o cliente")
        })

        exibirDados()
    }
}
function mostrarModal() {
    let containerModal = document.getElementById("container-modal")
    containerModal.style.display = "flex"
}
function ocultarModal() {
    let containerModal = document.getElementById("container-modal")
    containerModal.style.display = "none"
}
function cancelar() {
    ocultarModal()
    limparForm()
}
function salvar() {
    let nome = document.getElementById("nome").value
    let cpf = document.getElementById("cpf").value
    let telefone = document.getElementById("telefone").value
    
    let whatsapp = document.getElementById("whatsapp").value 
    let sexoCalopsita = document.getElementById("sexoCalopsita").value 


    //se não estiver alterando ninguém, adiciona no vetor
    if (clienteAlterado == null) {
        let cliente = {
            "nome": nome,
            "cpf": cpf,
            "telefone": telefone,
            "whatsapp": whatsapp,
            "sexoCalopsita" : sexoCalopsita
        }

        //salva o cliente no back-end
        fetch("http://localhost:3000/cadastrar", {
            headers: {
                "Content-type": "application/json"
            },
            method: "POST",
            body: JSON.stringify(cliente)
        }).then(() => {
            clienteAlterado = null
            //limpa o form
            limparForm()
            ocultarModal()
            
            recarregarClientes();
            alert("Cliente cadastrado com sucesso!")
        }).catch(() => {
            alert("Ops... algo deu errado!")
        })

       
    } else {
        clienteAlterado.nome = nome
        clienteAlterado.cpf = cpf
        clienteAlterado.telefone = telefone

        //CAMPO ADICIONAL
        clienteAlterado.whatsapp = whatsapp
        clienteAlterado.sexoCalopsita = sexoCalopsita

        fetch("http://localhost:3000/alterar/",{
            headers: {
                "Content-type": "application/json"
            },
            method: "PUT",
            body:  JSON.stringify(clienteAlterado)
        }).then((response) => {
            
            clienteAlterado = null
            //limpa o form
            limparForm()
            ocultarModal()

            recarregarClientes();
            alert("Cliente Alterado com sucesso!")
        }).catch((error) => {
            alert("Não foi possível alterar o cliente")
        })
    }

}

function exibirDados() {

    let tbody = document.querySelector("#table-customers tbody")

    //antes de listar os clientes, limpa todas as linhas
    tbody.innerHTML = ""

    clientes.sort((a, b) => a.nome.localeCompare(b.nome, 'pt', { sensitivity: 'base' }))

    for (let i = 0; i < clientes.length; i++) {
        let linha = `
        <tr>
            <td>${clientes[i].nome}</td>
            <td>${clientes[i].cpf}</td>
            <td>${clientes[i].telefone}</td>

            <td>${clientes[i].whatsapp}</td>
            <td>${clientes[i].sexoCalopsita}</td>
            <td>
                <button onclick="alterar('${clientes[i].cpf}')">Alterar</button>
                <button onclick="excluir('${clientes[i].cpf}')" class="botao-excluir">Excluir</button>
            </td>
        </tr>`

        let tr = document.createElement("tr")
        tr.innerHTML = linha

        tbody.appendChild(tr)
    }

}
function limparForm() {
    document.getElementById("nome").value = ""
    document.getElementById("cpf").value = ""
    document.getElementById("telefone").value = ""
    
    document.getElementById("whatsapp").value = ""
    document.getElementById("sexoCalopsita").value = ""

}

function recarregarClientes() {
    fetch("http://localhost:3000/listar", {
        headers: {
            "Content-type": "application/json"
        },
        method: "GET"
    }).then((response) => response.json()) //converte a resposta para JSON
        .then((response) => {
            console.log(response)
            clientes = response
            exibirDados()
        }).catch((error) => {
            alert("Erro ao listar os clientes")
        })
}

function buscarClientes() {
    const searchTerm = document.getElementById('buscar').value;

    fetch(`http://localhost:3000/buscar?q=${encodeURIComponent(searchTerm)}`, {
        headers: {
            "Content-type": "application/json"
        },
        method: "GET"
    }).then(response => response.json())
      .then(filteredClientes => {
          // Display filtered clients
          let tbody = document.querySelector("#table-customers tbody");
          tbody.innerHTML = ""; // Clear existing rows

          filteredClientes.forEach(cliente => {
              let linha = `
              <tr>
                  <td>${cliente.nome}</td>
                  <td>${cliente.cpf}</td>
                  <td>${cliente.telefone}</td>
                  <td>${cliente.whatsapp}</td>
                  <td>${cliente.sexoCalopsita}</td>
                  <td>
                      <button onclick="alterar('${cliente.cpf}')">Alterar</button>
                      <button onclick="excluir('${cliente.cpf}')" class="botao-excluir">Excluir</button>
                  </td>
              </tr>`;
              let tr = document.createElement("tr");
              tr.innerHTML = linha;
              tbody.appendChild(tr);
          });
      })
      .catch(error => {
          alert("Erro ao buscar clientes");
          console.error(error);
      });
}