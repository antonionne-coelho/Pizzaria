import express from "express";
import cors from "cors";
import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import serviceAccount from "./firebase-key.json" with { type: "json" };

console.log("Projeto:", serviceAccount.project_id);
console.log("Email:", serviceAccount.client_email);

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();
const app = express();

app.use(cors());
app.use(express.json());

// Rota base de teste
app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

// ========== ROTA DE CADASTRO (AJUSTADA COM ROLES) ==========
app.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        // Padroniza o e-mail em minúsculas para checagem segura
        const emailNormalizado = email.toLowerCase();

        // REGRA DE OURO: Define se o usuário é administrador ou cliente comum
        const tipo = (emailNormalizado === "antonionnecp7@gmail.com") ? "admin" : "cliente";

        const docRef = await db.collection("usuarios").add({
            nome,
            email: emailNormalizado,
            senha,
            tipo, 
            criadoEm: new Date()
        });

        res.status(201).json({
            sucesso: true,
            message: "Cadastro realizado com sucesso!",
            id: docRef.id
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ sucesso: false, erro: erro.message });
    }
});

// ========== ROTA DE LOGIN (AJUSTADA COM ROLES) ==========
app.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Padroniza o e-mail recebido no login para bater com o banco
        const emailNormalizado = email.toLowerCase();

        // Procura no Firebase se existe um usuário com o mesmo email e senha
        const userSnapshot = await db.collection("usuarios")
            .where("email", "==", emailNormalizado)
            .where("senha", "==", senha)
            .get();

        if (userSnapshot.empty) {
            return res.status(401).json({ error: "Email ou senha incorretos!" });
        }

        // Pega os dados do usuário encontrado
        let usuarioEncontrado = {};
        userSnapshot.forEach(doc => {
            usuarioEncontrado = doc.data();
        });

        // Retorna o sucesso e os dados do usuário (incluindo o tipo) para o frontend
        res.status(200).json({
            sucesso: true,
            user: {
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email,
                tipo: usuarioEncontrado.tipo || "cliente" 
            }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro interno no servidor ao fazer login." });
    }
});

// ========== ROTA DE SALVAR PEDIDO ==========
app.post("/pedidos", async (req, res) => {
    try {
        const { email_cliente, nome_cliente, itens, total } = req.body;

        if (!email_cliente) {
            return res.status(400).json({ error: "Sessão inválida. Faça login novamente." });
        }

        const docRef = await db.collection("pedidos").add({
            email_cliente: email_cliente.toLowerCase(),
            nome_cliente,
            itens,
            total,
            status: "PREPARANDO", // Novo padrão oficial definido
            criadoEm: new Date()
        });

        res.status(201).json({
            sucesso: true,
            message: "Pedido enviado com sucesso para a cozinha!",
            id_pedido: docRef.id
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro interno ao salvar o pedido." });
    }
});

// ========== ROTA DE BUSCAR PEDIDOS DO CLIENTE (PASSO 5) ==========
app.get("/pedidos/cliente/:email", async (req, res) => {
    try {
        const emailNormalizado = req.params.email.toLowerCase();
        
        // Puxa do Firebase todos os pedidos onde o email bate com o email enviado
        const pedidosSnapshot = await db.collection("pedidos")
            .where("email_cliente", "==", emailNormalizado)
            .get();

        let meusPedidos = [];
        pedidosSnapshot.forEach(doc => {
            meusPedidos.push({
                id: doc.id, 
                ...doc.data()
            });
        });

        // Ordena no servidor para o pedido mais novo aparecer no topo da lista
        meusPedidos.sort((a, b) => b.criadoEm._seconds - a.criadoEm._seconds);

        res.status(200).json(meusPedidos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro ao buscar o histórico de pedidos." });
    }
});

// ========== ROTA DE CANCELAR PEDIDO (PASSO 5 B) ==========
app.delete("/pedidos/:id", async (req, res) => {
    try {
        const idPedido = req.params.id;
        const pedidoRef = db.collection("pedidos").doc(idPedido);
        const pedidoDoc = await pedidoRef.get();

        if (!pedidoDoc.exists) {
            return res.status(404).json({ error: "Pedido não encontrado." });
        }

        const statusAtual = pedidoDoc.data().status;

        // TRAVA DE SEGURANÇA: Regra de negócio exigida para o cancelamento
        if (statusAtual === "SAIU PARA ENTREGA" || statusAtual === "FINALIZADO") {
            return res.status(400).json({ 
                error: `Cancelamento bloqueado! O status atual do pedido é: ${statusAtual}` 
            });
        }

        // Se passar pela trava (estiver como "PREPARANDO"), deleta o pedido
        await pedidoRef.delete();

        res.status(200).json({ sucesso: true, message: "Seu pedido foi cancelado com sucesso." });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro interno ao tentar cancelar o pedido." });
    }
});

// ========== ROTA DE BUSCAR TODOS OS PEDIDOS (ADMIN - PASSO 7) ==========
app.get("/pedidos/todos", async (req, res) => {
    try {
        const pedidosSnapshot = await db.collection("pedidos").get();
        let todosPedidos = [];

        pedidosSnapshot.forEach(doc => {
            todosPedidos.push({
                id: doc.id,
                ...doc.data()
            });
        });

        // Ordena para que o painel mostre sempre os pedidos mais novos no topo
        todosPedidos.sort((a, b) => b.criadoEm._seconds - a.criadoEm._seconds);

        res.status(200).json(todosPedidos);
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro ao buscar a lista geral de pedidos." });
    }
});

// ========== ROTA DE ATUALIZAR STATUS DO PEDIDO (ADMIN - PASSO 8) ==========
app.put("/pedidos/:id/status", async (req, res) => {
    try {
        const idPedido = req.params.id;
        const { status } = req.body; 

        if (!status) {
            return res.status(400).json({ error: "O novo status não foi informado." });
        }

        const pedidoRef = db.collection("pedidos").doc(idPedido);
        const pedidoDoc = await pedidoRef.get();

        if (!pedidoDoc.exists) {
            return res.status(404).json({ error: "Pedido não encontrado no banco." });
        }

        // Faz o update apenas do campo status no Firebase
        await pedidoRef.update({ status: status });

        res.status(200).json({ sucesso: true, message: `Status do pedido atualizado para: ${status}` });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro interno ao tentar atualizar o status do pedido." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});