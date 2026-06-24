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
            tipo, // Grava a regra de acesso direto na nuvem
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
                tipo: usuarioEncontrado.tipo || "cliente" // Passa o tipo ("admin" ou "cliente") para a Navbar dinamicamente
            }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro interno no servidor ao fazer login." });
    }
});

// ========== ROTA DE SALVAR PEDIDO (NOVO - PASSO 3) ==========
app.post("/pedidos", async (req, res) => {
    try {
        // Recebe os dados do carrinho enviados pelo frontend
        const { email_cliente, nome_cliente, itens, total } = req.body;

        // Salva na nova coleção "pedidos" no Firebase
        const docRef = await db.collection("pedidos").add({
            email_cliente: email_cliente.toLowerCase(),
            nome_cliente,
            itens,
            total,
            status: "Recebido", // Todo pedido novo entra com esse status por padrão
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

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});