function showSection(sectionId) {
    // Esconde todas as seções
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        sec.style.display = 'none';
    });

    // Mostra apenas a seção clicada
    const target = document.getElementById(sectionId);
    if (target) {
        // Se for home, usamos flex para centralizar o texto da capa
        target.style.display = (sectionId === 'home') ? 'flex' : 'block';
    }
}

function carregarCategoria(tipo) {
    const container = document.getElementById("conteudo-cardapio");

    let html = "";

    if (tipo === "pizzas") {
        html = `
        <div class="cardapio-content">
            <h2>Pizzas</h2>

            ${criarPizza("Calabresa","img/pizza-de-calabresa.jpg","35,00", "42,00", "49,00")}
            ${criarPizza("Frango","img/pizza-de-frango.png","28,00", "35,00", "40,00")}

            ${criarPizza("Queijo","img/pizza-de-queijo.png","29,00", "31,00", "36,00")}
            ${criarPizza("Portuguesa","img/pizza-portuguesa.jpg","32,00", "38,00", "45,00")}
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

        ${criarBebida("Suco de Cajá","img/suco-de-caja.jpeg","7,00")}
        ${criarBebida("Coca 1L","img/coca-cola.png","8,00")}
        ${criarBebida("Heineken Long Neck","img/heineken.jpg","10,00")}

    </div>
    `;
}

    container.innerHTML = html;
}

/* Funções auxiliares */

function criarPizza(nome, img, p, m, g) {
    return `
    <div class="pizza-item">
        <div class="pizza-left">
            <img src="${img}" alt="${nome}">
            <h3>${nome}</h3>
        </div>

        <div class="pizza-precos">
            <span>P: R$ ${p}</span>
            <span>M: R$ ${m}</span>
            <span>G: R$ ${g}</span>
        </div>
    </div>
    `;
}

function criarPastel(nome, img, preco) {
    return `
    <div class="pastel-item">
        <div class="pastel-info">
            <img src="${img}" alt="${nome}">
            <h3>${nome}</h3>
        </div>

        <span>R$ ${preco}</span>
    </div>
    `;
}

function criarPetisco(nome, img, preco) {
    return `
    <div class="petisco-item">
        <div class="petisco-info">
            <img src="${img}" alt="${nome}">
            <h3>${nome}</h3>
        </div>

        <span>R$ ${preco}</span>
    </div>
    `;
}

function criarBebida(nome, img, preco) {
    return `
    <div class="bebida-item">
        <div class="bebida-info">
            <img src="${img}" alt="${nome}">
            <h3>${nome}</h3>
        </div>

        <span>R$ ${preco}</span>
    </div>
    `;
}

// Validação de senha no cadastro
const formCadastro = document.querySelector('#cadastro form');

formCadastro.addEventListener('submit', function(e) {
    const senha = formCadastro.children[2].value;
    const confirmar = formCadastro.children[3].value;

    if (senha !== confirmar) {
        e.preventDefault();
        alert("As senhas não coincidem!");
    } else {
        alert("Cadastro enviado com sucesso!");
    }
});