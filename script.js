// ===== CONFIGURAÇÃO DA API =====
const API_URL = 'http://localhost:3000';

// ===== LÓGICA DO CARRINHO DE COMPRAS =====
let carrinho = [];
const TAXA_ENTREGA = 5.00;

function showSection(sectionId) {
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        sec.style.display = 'none';
    });
    const target = document.getElementById(sectionId);
    if (target) {
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

/* Funções auxiliares mantidas integralmente */
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
        alert("Primeiro faça login!");
        showSection('login'); 
        return; 
    }
    const item = { nome: nome, preco: preco };
    carrinho.push(item); 
    alert(`${nome} adicionado!`);
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
    if (logado !== "true") { alert("Faça login!"); showSection('login'); return; }
    if (carrinho.length === 0) { alert("Carrinho vazio!"); return; }

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

        if (resposta.ok) {
            alert("Pedido enviado!");
            carrinho = [];
            atualizarInterfaceCarrinho();
            abrirMeusPedidos(); 
        } else {
            alert("Erro ao fechar o pedido.");
        }
    } catch (erro) {
        console.error(erro);
        alert("Erro ao conectar.");
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
    container.innerHTML = "<p>Carregando...</p>";

    try {
        const resposta = await fetch(`${API_URL}/pedidos/cliente/${email}`);
        const pedidos = await resposta.json();
        
        let html = "";
        pedidos.forEach(pedido => {
            let dataFormatada = pedido.criadoEm ? new Date(pedido.criadoEm._seconds * 1000).toLocaleString('pt-BR') : "Data desconhecida";
            let itensHtml = `<ul>${pedido.itens.map(i => `<li>${i.nome}</li>`).join('')}</ul>`;
            let botao = (pedido.status === "PREPARANDO") ? `<button onclick="cancelarPedido('${pedido.id}')">Cancelar Pedido</button>` : `<p>Status: ${pedido.status}</p>`;
            
            html += `<div class="pedido-card"><h3>${dataFormatada}</h3>${itensHtml}<p>Total: R$ ${pedido.total.toFixed(2)}</p>${botao}</div>`;
        });
        container.innerHTML = html || "<p>Nenhum pedido.</p>";
    } catch (e) { container.innerHTML = "<p>Erro.</p>"; }
}

async function cancelarPedido(idPedido) {
    if (!confirm("Cancelar?")) return;
    try {
        const resposta = await fetch(`${API_URL}/pedidos/${idPedido}`, { method: "DELETE" });
        if (resposta.ok) { carregarMeusPedidos(); }
    } catch (e) { alert("Erro."); }
}

// ===== PAINEL DO ADMINISTRADOR (PASSO 9) =====
function abrirPainelAdmin() {
    showSection('painel-admin');
    carregarPedidosAdmin();
}

async function carregarPedidosAdmin() {
    const container = document.getElementById("container-admin-pedidos");
    container.innerHTML = "<p>Carregando...</p>";
    try {
        const resposta = await fetch(`${API_URL}/pedidos/todos`);
        const todosPedidos = await resposta.json();
        let html = "";
        todosPedidos.forEach(pedido => {
            html += `
                <div style="background: #fff; border: 1px solid #ccc; padding: 15px; margin: 10px auto; max-width: 500px; border-radius: 8px;">
                    <p><strong>Cliente:</strong> ${pedido.nome_cliente}</p>
                    <p><strong>Status:</strong> ${pedido.status}</p>
                    <button onclick="mudarStatus('${pedido.id}', 'SAIU PARA ENTREGA')">Saiu para Entrega</button>
                    <button onclick="mudarStatus('${pedido.id}', 'FINALIZADO')" style="background-color: #2ecc71;">Finalizar</button>
                </div>
            `;
        });
        container.innerHTML = html;
    } catch (e) { container.innerHTML = "<p>Erro ao carregar.</p>"; }
}

async function mudarStatus(id, novoStatus) {
    try {
        const resposta = await fetch(`${API_URL}/pedidos/${id}/status`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: novoStatus })
        });
        if (resposta.ok) { alert("Atualizado!"); carregarPedidosAdmin(); }
    } catch (e) { alert("Erro."); }
}

// ===== CADASTRO =====
document.getElementById("formCadastro").addEventListener("submit", async function(e) {
    e.preventDefault();
    const [nome, email, senha, confirmar] = [document.getElementById("cadNome").value, document.getElementById("cadEmail").value, document.getElementById("cadSenha").value, document.getElementById("cadConfirmar").value];
    if (senha !== confirmar) { alert("Senhas diferentes!"); return; }
    try {
        const res = await fetch(`${API_URL}/cadastro`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ nome, email, senha }) });
        if (res.ok) { alert("Cadastrado!"); showSection('login'); }
    } catch (e) { alert("Erro."); }
});

// ===== LOGIN =====
document.getElementById("formLogin").addEventListener("submit", async function(e) {
    e.preventDefault();
    const [email, senha] = [document.getElementById("loginEmail").value, document.getElementById("loginSenha").value];
    try {
        const res = await fetch(`${API_URL}/login`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, senha }) });
        const dados = await res.json();
        if (res.ok) {
            localStorage.setItem("logado", "true");
            localStorage.setItem("nomeUsuario", dados.user.nome);
            localStorage.setItem("emailUsuario", dados.user.email);
            localStorage.setItem("tipoUsuario", dados.user.tipo);
            atualizarMenu(); showSection('home');
        } else { alert(dados.error); }
    } catch (e) { alert("Erro."); }
});

// ===== ATUALIZA MENU =====
function atualizarMenu() {
    const logado = localStorage.getItem("logado");
    const tipo = localStorage.getItem("tipoUsuario");
    const containerUsuario = document.getElementById("menuUsuario");
    const btnAdminExistente = document.getElementById("btnAdminNav");
    
    if (btnAdminExistente) btnAdminExistente.remove();

    if (logado === "true") {
        document.getElementById("menuCadastro").style.display = "none";
        document.getElementById("menuLogin").style.display = "none";
        containerUsuario.style.display = "block";
        document.getElementById("nomeUsuarioNav").innerText = localStorage.getItem("nomeUsuario");
        document.getElementById("menuMeusPedidos").style.display = (tipo === "admin") ? "none" : "block";

        if (tipo === "admin") {
            const adminLi = document.createElement("li");
            adminLi.id = "btnAdminNav";
            adminLi.innerHTML = `<a href="#" onclick="abrirPainelAdmin()" style="color: #ffcc00;">Painel Cozinha</a>`;
            document.querySelector(".nav-links").insertBefore(adminLi, containerUsuario);
        }
    } else {
        document.getElementById("menuCadastro").style.display = "block";
        document.getElementById("menuLogin").style.display = "block";
        containerUsuario.style.display = "none";
        document.getElementById("menuMeusPedidos").style.display = "none";
    }
}

// ===== UTILITÁRIOS =====
function toggleDropdown(e) { e.preventDefault(); document.querySelector('.dropdown-content').classList.toggle('show'); }
function logout() {
    localStorage.clear();
    carrinho = [];
    atualizarInterfaceCarrinho();
    atualizarMenu();
    showSection('home');
    alert("Você saiu!");
}
window.onload = () => { atualizarMenu(); atualizarInterfaceCarrinho(); };