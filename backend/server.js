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

// ========== ROTA DE CADASTRO ==========
app.post("/cadastro", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const docRef = await db.collection("usuarios").add({
            nome,
            email,
            senha,
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

// ========== ROTA DE LOGIN (ADICIONADA AGORA) ==========
app.post("/login", async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Procura no Firebase se existe um usuário com o mesmo email e senha
        const userSnapshot = await db.collection("usuarios")
            .where("email", "==", email)
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

        // Retorna o sucesso e os dados do usuário para o frontend
        res.status(200).json({
            sucesso: true,
            user: {
                nome: usuarioEncontrado.nome,
                email: usuarioEncontrado.email
            }
        });
    } catch (erro) {
        console.error(erro);
        res.status(500).json({ error: "Erro interno no servidor ao fazer login." });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});