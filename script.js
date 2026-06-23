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

    // Configurando o fundo de acordo com a categoria
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

/* Funções auxiliares com botões de adicionar ao carrinho */

function criarPizza(nome, img, p, m, g) {
    const precoNum = parseFloat(m.replace(',', '.')); // Uses Medium price as default numerical value
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

// ===== CONTROLE INTERNO DO CARRINHO =====

function adicionarAoCarrinho(nome, preco) {
    // TRAVA: Verifica se o usuário está autenticado
    const logado = localStorage.getItem("logado");

    if (logado !== "true") {
        alert("Primeiro faça login para poder adicionar ao seu carrinho");
        showSection('login'); // Redireciona o cliente para a tela de login
        return; // Interrompe a execução
    }

    const item = {
        nome: nome,
        preco: preco
    };
    
    carrinho.push(item); // Ordem de adição garantida
    alert(`${nome} adicionado ao carrinho!`);
    
    atualizarInterfaceCarrinho();
}

function atualizarInterfaceCarrinho() {
    // Atualiza a contagem no menu superior
    const contador = document.getElementById("contador-carrinho");
    if (contador) {
        contador.innerText = carrinho.length;
    }

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

function fecharPedido() {
    // TRAVA ADICIONAL: Garante que só fecha pedido se estiver logado
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

    alert("Confirmar pedido pronto! Seu pedido foi enviado.");
    
    // Limpa a memória local após fechar a compra
    carrinho = [];
    atualizarInterfaceCarrinho();
    showSection('home');
}

// ===== CADASTRO (PREPARADO PARA A API) =====
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
            headers: {
                "Content-Type": "application/json"
            },
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

    const email = document.getElementById("loginEmail").value;
    const senha = document.getElementById("loginSenha").value;

    try {
        const resposta = await fetch(`${API_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, senha })
        });

        const dados = await resposta.json();

        if (resposta.ok) {
            localStorage.setItem("logado", "true");
            localStorage.setItem("nomeUsuario", dados.user.nome);
            
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

    if (logado === "true") {
        document.getElementById("menuUsuario").style.display = "block";
    } else {
        document.getElementById("menuUsuario").style.display = "none";
    }
}

// ===== LOGOUT =====
function logout() {
    localStorage.removeItem("logado");
    localStorage.removeItem("nomeUsuario");
    alert("Você saiu!");
    atualizarMenu();
}

// ===== AO CARREGAR A PÁGINA =====
window.onload = function() {
    atualizarMenu();
    atualizarInterfaceCarrinho();
};