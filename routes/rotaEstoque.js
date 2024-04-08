const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");




db.run("CREATE TABLE IF NOT EXISTS estoque (id INTEGER PRIMARY KEY AUTOINCREMENT, id_produto INTEGER, quantidade REAL, valor_unitario REAL, data_saida DATE)", (createTableError) => {


    if (createTableError) {
        
        return res.status(500).send({
            error: createTableError.message
        });
    }

    // O restante do código, se necessário...
});
// Rota para obter uma estoque pelo ID
router.get("/:id", (req, res, next) => {
    const { id } = req.params;

    db.all("SELECT * FROM estoque WHERE id=?", [id], (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        res.status(200).send({
            mensagem: "Aqui está a estoque  solicitado",
            estoques: rows
        });
    });
});









// Rota para listar todos os estoques 
// Rota para listar todos os estoques 
router.get("/", (req, res, next) => {
    db.all(`SELECT 
    estoque.id as id, 
    estoque.id_produto as id_produto,
    estoque.quantidade as quantidade,
    produto.descricao as descricao,
    estoque.valor_unitario as valor_unitario
    FROM estoque 
    INNER JOIN produto 
    ON estoque.id_produto = produto.id`, (error, rows) => {

        if (error) {  
                    
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send({
            mensagem: "Aqui está a lista de todas as estoque",
            estoques: rows // Corrigindo para retornar a propriedade "estoque"
        });
    });
});









// Rota para criar um novo estoques 
router.post('/', (req, res, nxt) => {


    console.log("passei aqui")
    const { id_produto, quantidade, valor_unitario, data_saida } = req.body;

    // Validação dos campos
    let msg = [];
    var regex = /^[0-9]+$/
    if (!id_produto) {
        console.log("status deu merda")
        msg.push({ mensagem: "id do produto inválido! Não pode ser vazio." });
    }
    console.log("erro linha 95")
    if (!quantidade || quantidade.length == 0) {
        console.log("descrição deu merda")
        msg.push({ mensagem: "Quantidade inválida!" });
    }
    // if (!estoqueminimo || senha.length < 6) {
    //     msg.push({ mensagem: "Senha inválida! Deve ter pelo menos 6 caracteres." });
    // }
    //if (!estoquemaximo || senha.length < 6) {
    //   msg.push({ mensagem: "Senha inválida! Deve ter pelo menos 6 caracteres." });
    // }
    if (msg.length > 0) {
        console.log(error)
        return res.status(400).send({
            mensagem: "Falha ao cadastrar saida.",
            erros: msg
        });
    }



    
    // Insere o nova estoque  no banco de dados
    db.run(`INSERT INTO SAIDA ( id_produto, quantidade,valor_unitario,data_saida) VALUES (?,?,?,?)`,
        [id_produto, quantidade, valor_unitario, data_saida], function (insertError) {
            console.log(insertError)
            if (insertError) {
                return res.status(500).send({
                    error: insertError.message,
                    response: null
                });
            }
            res.status(201).send({
                mensagem: "saida criado com sucesso!",
                estoques: {
                    id: this.lastID,
                    quantidade,
                    valor_unitario: valor_unitario,
                    data_saida
                }
            });
        });
});






// Rota para atualizar um estoque existente
router.put("/", (req, res, next) => {
    const { id, id_produto, quantidade, valor_unitario, data_saida } = req.body;

    if (!id_produto || !quantidade || !valor_unitario || !data_saida) {

        return res.status(400).send({ error: "Parâmetros inválidos" });
    }


    db.run("UPDATE estoque SET id_produto=?, quantidade=?, valor_unitario=?,data_saida=? WHERE id=?", [id_produto, quantidade, valor_unitario, data_saida, id], (error) => {
        if (error) {

            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send({ mensagem: SUCCESS_MESSAGE });
    });
});






// Rota para excluir um usuário pelo ID
router.delete("/:id", (req, res, next) => {
    const { id } = req.params;
    db.run("DELETE FROM saida WHERE id=?", id, (error) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send({ mensagem: SUCCESS_MESSAGE });
    });
});

module.exports = router;
