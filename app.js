const express = require('express')
const app = express();
const usuario = [
    {
        id: 1,
        nome: "Nero",
        email: "nero@gmail.com",
        senha: "1012"
    },
    {
        id: 2,
        nome: "Silva",
        email: "silva@gmail.com",
        senha: "1012"
    },
    {
        id: 3,
        nome: "Cauê",
        email: "cauê@gmail.com",
        senha: "1012"
    },
    {
        id: 4,
        nome: "Carlos",
        email: "carlos@gmail.com",
        senha: "1012"
    },
]
app.get("/", (req, res, next) => {
    res.json(usuario)
})

app.get("/usuario", (req, res, next) => {
    let nomes = [];
    usuario.map((linha) => {
        nomes.push({
            nome: linha.nome,
            email: linha.email

        })
    })

    res.json(nomes)

})
app.post("/usuario", (req, res, next) => {
    const id = req.body.id
    const nome = req.body.nome;
    const email = req.body.email;
    const senha = req.body.senha;
    const dados = [{
        id,
        nome,
        email,
        senha
    }]
    console.table(dados);

});

module.exports = app