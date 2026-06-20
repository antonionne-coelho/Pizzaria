import express from "express";
import cors from "cors";

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

import serviceAccount from "./firebase-key.json" with { type: "json" };

initializeApp({
    credential: cert(serviceAccount)
});

const db = getFirestore();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Servidor funcionando!");
});

app.get("/teste-firebase", async (req, res) => {
    try {

        const docRef = await db.collection("teste").add({
            mensagem: "Firebase conectado!",
            data: new Date()
        });

        res.json({
            sucesso: true,
            id: docRef.id
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            sucesso: false,
            erro: erro.message
        });

    }
});

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
            id: docRef.id
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            sucesso: false,
            erro: erro.message
        });

    }

});

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});