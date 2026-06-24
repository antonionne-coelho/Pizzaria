// ===== CONFIGURAÇÃO DA API =====
// Mantido sem o /api para casar exatamente com as rotas criadas no seu server.js
const API_URL = 'http://localhost:3000';

// ===== LÓGICA DO CARRINHO DE COMPRAS =====
let carrinho = [];
const TAXA_ENTREGA = 5.00;

function showSection(sectionId) {
    // Esconde todas as seções
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        sec.style.display = 'none';
    });

    // Mostrando apenas a seção clicada
    const target = document.getElementById(sectionId);
    if (target) {
        // Se for home, usamos flex para centralizar o texto da capa
        target.style.display = (sectionId === 'home') ? 'flex' : 'block';
    }
}

function carregarCategoria(tipo) {
    const container = document.getElementById("conteudo-cardapio");

    if (tipo === "pizzas") {
        container.style.backgroundImage = "url('img/pizzas-fundo.jpg')";
    } else if (tipo === "pasteis") {
        container.style.backgroundImage = "url('img/pasteis-fundo.jpeg')";
    } else if (tipo === "petiscos") {
        container.style.backgroundImage = "url('img/petisco-fundo.jpg')";
    } else if (tipo === "bebidas") {
        container.style.backgroundImage = "url('img/bebidas-fundo.jpg')";
    }

    let html = "";

    if (tipo === "pizzas") {
        html = `
        <div class="cardapio-content">
            <h2>Pizzas</h2>
            ${criarPizza("Calabresa","img/pizza-de-calabresa.jpg","35,00", "42,00", "49,00")}
            ${criarPizza("Frango","img/pizza-de-frango.png","28,00", "35,00", "40,00")}
            ${criarPizza("Queijo","img/pizza-de-queijo.png","29,00", "31,00", "36,00")}
            ${criarPizza("Portuguesa","img/pizza-portuguesa.jpg","32,00", "38,00", "45,00")}
            ${criarPizza("Camarão","img/pizza-de-camarao.png","45,00", "52,00", "60,00")}
        </div>
        `;
    }
    else if (tipo === "pasteis") {
        html = `
        <div class="cardapio-content">
            <h2>Pastéis</h2>
            ${criarPastel("Carne","img/pastel-de-carne.jpg","11,00")}
            ${criarPastel("Queijo","img/pastel-de-queijo.jpg","9,00")}
            ${criarPastel("Frango","img/pastel-de-frango.jpg","10,00")}
            ${criarPastel("Pizza","img/pastel-de-pizza.jpg","10,00")}
            ${criarPastel("Camarão","img/pastel-de-camarao.jpg","14,00")}
        </div>
        `;
    }
    else if (tipo === "petiscos") {
        html = `
        <div class="cardapio-content">
            <h2>Petiscos</h2>
            ${criarPetisco("Filé com fritas","img/file-com-fritas.jpg","40,00")}
            ${criarPetisco("Fritas com Cheddar e Bacon","img/batata-frita.jpg","20,00")}
        </div>
        `;
    }
    else if (tipo === "bebidas") {
        html = `
        <div class="cardapio-content">
            <h2>Bebidas</h2>
            ${criarBebida("Suco de Limão","img/suco-de-limão.jpeg","7,00")}
            ${criarBebida("Suco de Laranja","img/suco-de-laranja.jpg","7,00")}
            ${criarBebida("Suco de Uva","img/suco-de-uva.jpg","7,00")}
            ${criarBebida("Suco de Cajá","img/suco-de-caja.jpeg","7,00")}
            ${criarBebida("Coca 1L","img/coca-cola.png","10,00")}
            ${criarBebida("Devassa","img/devassa.jpg","6,00")}
            ${criarBebida("Heineken Long Neck","img/heineken.jpg","12,00")}
        </div>
        `;
    }

    container.innerHTML = html;
}

/* Funções auxiliares */
function criarPizza(nome, img, p, m, g) {
    const precoNum = parseFloat(m.replace(',', '.')); 
    return `
    <div class="pizza-item">
        <div class="pizza-left">
            <img src="${img}" alt="${nome}">
            <h3>${nome} (M)</h3>
        </div>
        <div class="pizza-precos">
            <span>P: R$ ${p}</span>
            <span>M: R$ ${m}</span>
            <span>G: R$ ${g}</span>
        </div>
        <button onclick="adicionarAoCarrinho('${nome} (M)', ${precoNum})">Adicionar</button>
    </div>
    `;
}

function criarPastel(nome, img, preco) {
    const precoNum = parseFloat(preco.replace(',', '.'));
    return `
    <div class="pastel-item">
        <div class="pastel-info">
            <img src="${img}" alt="${nome}">
            <h3>${nome}</h3>
        </div>
        <span>R$ ${preco}</span>
        <button onclick="adicionarAoCarrinho('${nome}', ${precoNum})">Adicionar</button>
    </div>
    `;
}

function criarPetisco(nome, img, preco) {
    const precoNum = parseFloat(preco.replace(',', '.'));
    return `
    <div class="petisco-item">
        <div class="petisco-info">
            <img src="${img}" alt="${nome}">
            <h3>${nome}</h3>
        </div>
        <span>R$ ${preco}</span>
        <button onclick="adicionarAoCarrinho('${nome}', ${precoNum})">Adicionar</button>
    </div>
    `;
}

function criarBebida(nome, img, preco) {
    const precoNum = parseFloat(preco.replace(',', '.'));
    return `
    <div class="bebida-item">
        <div class="bebida-info">
            <img src="${img}" alt="${nome}">
            <h3>${nome}</h3>
        </div>
        <span>R$ ${preco}</span>
        <button onclick="adicionarAoCarrinho('${nome}', ${precoNum})">Adicionar</button>
    </div>
    `;
}

// ===== CONTROLE DO CARRINHO =====
function adicionarAoCarrinho(nome, preco) {
    const logado = localStorage.getItem("logado");

    if (logado !== "true") {
        alert("Primeiro faça login para poder adicionar ao seu carrinho");
        showSection('login'); 
        return; 
    }

    const item = { nome: nome, preco: preco };
    carrinho.push(item); 
    alert(`${nome} adicionado ao carrinho!`);
    atualizarInterfaceCarrinho();
}

function atualizarInterfaceCarrinho() {
    const contador = document.getElementById("contador-carrinho");
    if (contador) contador.innerText = carrinho.length;

    const listaContainer = document.getElementById("lista-carrinho");
    const valorTotalContainer = document.getElementById("valor-total");

    if (!listaContainer || !valorTotalContainer) return;

    if (carrinho.length === 0) {
        listaContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
        valorTotalContainer.innerText = "R$ 0,00";
        return;
    }

    let htmlLista = "";
    let somaProdutos = 0;

    carrinho.forEach((item) => {
        somaProdutos += item.preco;
        htmlLista += `
            <div style="display: flex; justify-content: space-between; max-width: 400px; margin: 10px auto; border-bottom: 1px solid #ccc; padding: 5px 0;">
                <span>${item.nome}</span>
                <strong>R$ ${item.preco.toFixed(2).replace('.', ',')}</strong>
            </div>
        `;
    });

    listaContainer.innerHTML = htmlLista;
    const totalGeral = somaProdutos + TAXA_ENTREGA;
    valorTotalContainer.innerText = `R$ ${totalGeral.toFixed(2).replace('.', ',')}`;
}

async function fecharPedido() {
    const logado = localStorage.getItem("logado");

    if (logado !== "true") {
        alert("Primeiro faça login para poder fechar o seu pedido");
        showSection('login');
        return;
    }

    if (carrinho.length === 0) {
        alert("Seu carrinho está vazio! Adicione algum item antes de finalizar.");
        return;
    }

    let somaProdutos = 0;
    carrinho.forEach((item) => { somaProdutos += item.preco; });
    const totalGeral = somaProdutos + TAXA_ENTREGA;

    const emailUsuario = localStorage.getItem("emailUsuario");
    const nomeUsuario = localStorage.getItem("nomeUsuario");

    try {
        const resposta = await fetch(`${API_URL}/pedidos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email_cliente: emailUsuario,
                nome_cliente: nomeUsuario,
                itens: carrinho,
                total: totalGeral
            })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert(dados.message || "Pedido enviado com sucesso para a cozinha!");
            carrinho = [];
            atualizarInterfaceCarrinho();
            
            // Em vez de ir pra Home, já manda o cliente pra tela de Meus Pedidos pra ele ver a mágica!
            abrirMeusPedidos(); 
        } else {
            alert(dados.error || "Erro ao fechar o pedido.");
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor. Tente novamente.");
    }
}

// ===== MEUS PEDIDOS =====
function abrirMeusPedidos() {
    showSection('meus-pedidos');
    carregarMeusPedidos();
}

async function carregarMeusPedidos() {
    const email = localStorage.getItem("emailUsuario");
    if (!email) return;

    const container = document.getElementById("container-meus-pedidos");
    container.innerHTML = "<p>Carregando seus pedidos...</p>";

    try {
        const resposta = await fetch(`${API_URL}/pedidos/cliente/${email}`);
        const pedidos = await resposta.json();

        if (!resposta.ok) {
            container.innerHTML = `<p style="color:red;">Erro: ${pedidos.error}</p>`;
            return;
        }

        if (pedidos.length === 0) {
            container.innerHTML = "<p>Você ainda não fez nenhum pedido.</p>";
            return;
        }

        let html = "";
        pedidos.forEach(pedido => {
            // Formatar Data e Hora
            let dataFormatada = "Data desconhecida";
            if (pedido.criadoEm && pedido.criadoEm._seconds) {
                const data = new Date(pedido.criadoEm._seconds * 1000);
                dataFormatada = data.toLocaleString('pt-BR');
            }

            // Lista os produtos do pedido
            let itensHtml = "<ul style='text-align: left; margin: 10px 0; padding-left: 20px;'>";
            pedido.itens.forEach(item => {
                itensHtml += `<li>${item.nome} - R$ ${item.preco.toFixed(2).replace('.', ',')}</li>`;
            });
            itensHtml += "</ul>";

            // Lógica das cores e botão do Status
            let corStatus = "#f39c12"; // Laranja para Preparando
            let botaoCancelar = `<button onclick="cancelarPedido('${pedido.id}')" style="background-color: #e74c3c; width: 100%; margin-top: 10px; border-radius: 4px;">Cancelar Pedido</button>`;
            
            if (pedido.status === "SAIU PARA ENTREGA") {
                corStatus = "#3498db"; // Azul
                botaoCancelar = `<p style="color: #7f8c8d; font-size: 0.9rem; margin-top: 10px;">O entregador já saiu. Cancelamento indisponível.</p>`;
            } else if (pedido.status === "FINALIZADO") {
                corStatus = "#2ecc71"; // Verde
                botaoCancelar = `<p style="color: #7f8c8d; font-size: 0.9rem; margin-top: 10px;">Pedido entregue com sucesso!</p>`;
            }

            html += `
                <div style="background: rgba(255, 255, 255, 0.9); border-radius: 8px; padding: 20px; width: 100%; max-width: 500px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); color: #333;">
                    <h3 style="border-bottom: 1px solid #ccc; padding-bottom: 10px; margin-bottom: 10px;">Data: ${dataFormatada}</h3>
                    <p style="font-size: 1.1rem;"><strong>Status:</strong> <span style="color: ${corStatus}; font-weight: bold;">${pedido.status}</span></p>
                    ${itensHtml}
                    <p style="font-size: 1.2rem; margin-top: 10px;"><strong>Total: R$ ${pedido.total.toFixed(2).replace('.', ',')}</strong></p>
                    ${botaoCancelar}
                </div>
            `;
        });

        container.innerHTML = html;

    } catch (erro) {
        console.error(erro);
        container.innerHTML = "<p style='color:red;'>Erro ao conectar com o servidor.</p>";
    }
}

async function cancelarPedido(idPedido) {
    const confirmacao = confirm("Tem certeza que deseja cancelar este pedido? Essa ação não pode ser desfeita.");
    if (!confirmacao) return;

    try {
        const resposta = await fetch(`${API_URL}/pedidos/${idPedido}`, {
            method: "DELETE"
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert(dados.message);
            carregarMeusPedidos(); // Recarrega a tela instantaneamente para sumir com o cartão
        } else {
            alert(dados.error);
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro de conexão ao tentar cancelar.");
    }
}

// ===== CADASTRO =====
document.getElementById("formCadastro").addEventListener("submit", async function(e) {
    e.preventDefault();

    const nome = document.getElementById("cadNome").value;
    const email = document.getElementById("cadEmail").value;
    const senha = document.getElementById("cadSenha").value;
    const confirmar = document.getElementById("cadConfirmar").value;

    if (senha !== confirmar) {
        alert("As senhas não coincidem!");
        return;
    }

    try {
        const resposta = await fetch(`${API_URL}/cadastro`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nome, email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            alert(dados.message || "Cadastro realizado com sucesso!");
            this.reset();
            showSection('login');
        } else {
            alert(dados.error || "Erro ao cadastrar.");
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
});

// ===== LOGIN =====
document.getElementById("formLogin").addEventListener("submit", async function(e) {
    e.preventDefault();

    const logadoAtualmente = localStorage.getItem("logado");
    if (logadoAtualmente === "true") {
        const usuarioAtivo = localStorage.getItem("nomeUsuario");
        alert(`Já existe um usuário logado (${usuarioAtivo}). Por favor, saia primeiro para poder entrar com outra conta.`);
        return;
    }

    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    try {
        const resposta = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            localStorage.setItem("logado", "true");
            localStorage.setItem("nomeUsuario", dados.user.nome);
            localStorage.setItem("emailUsuario", dados.user.email);
            localStorage.setItem("tipoUsuario", dados.user.tipo); 
            
            alert(`Bem-vindo(a), ${dados.user.nome}!`);
            atualizarMenu();
            this.reset();
            showSection('home');
        } else {
            alert(dados.error || "Email ou senha incorretos!");
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar com o servidor.");
    }
});

// ===== ATUALIZA MENU =====
function atualizarMenu() {
    const logado = localStorage.getItem("logado");
    const nomeUsuario = localStorage.getItem("nomeUsuario");
    const tipoUsuario = localStorage.getItem("tipoUsuario");

    const btnCadastro = document.getElementById("menuCadastro");
    const btnLogin = document.getElementById("menuLogin");
    const containerUsuario = document.getElementById("menuUsuario");
    const spanNomeNav = document.getElementById("nomeUsuarioNav");
    const btnMeusPedidos = document.getElementById("menuMeusPedidos"); 

    if (logado === "true") {
        if (btnCadastro) btnCadastro.style.display = "none";
        if (btnLogin) btnLogin.style.display = "none";
        
        if (spanNomeNav) spanNomeNav.innerText = nomeUsuario;
        if (containerUsuario) containerUsuario.style.display = "block";
        
        if (btnMeusPedidos) {
            btnMeusPedidos.style.display = (tipoUsuario === "cliente") ? "block" : "none";
        }
    } else {
        if (btnCadastro) btnCadastro.style.display = "block";
        if (btnLogin) btnLogin.style.display = "block";
        
        if (containerUsuario) containerUsuario.style.display = "none";
        if (btnMeusPedidos) btnMeusPedidos.style.display = "none";
    }
}

// ===== CONTROLE DO MENU DROPDOWN POR CLIQUE =====
function toggleDropdown(evento) {
    evento.preventDefault(); 
    const dropdown = document.querySelector('.dropdown-content');
    if (dropdown) {
        dropdown.classList.toggle('show'); 
    }
}

window.addEventListener('click', function(e) {
    if (!e.target.matches('.usuario-link') && !e.target.matches('#nomeUsuarioNav')) {
        const dropdown = document.querySelector('.dropdown-content');
        if (dropdown && dropdown.classList.contains('show')) {
            dropdown.classList.remove('show');
        }
    }
});

// ===== LOGOUT (AJUSTADO) =====
function logout() {
    localStorage.removeItem("logado");
    localStorage.removeItem("nomeUsuario");
    localStorage.removeItem("emailUsuario");
    localStorage.removeItem("tipoUsuario"); 
    
    const dropdown = document.querySelector('.dropdown-content');
    if (dropdown) dropdown.classList.remove('show');

    // AJUSTE: Zera o carrinho e atualiza o visual da tela antes de voltar para a Home
    carrinho = [];
    atualizarInterfaceCarrinho();

    alert("Você saiu!");
    atualizarMenu();
    showSection('home'); 
}

// ===== AO CARREGAR A PÁGINA =====
window.onload = function() {
    atualizarMenu();
    atualizarInterfaceCarrinho();
};