const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");



//criacao de tabela de saida no banco de dados caso ja existe 
db.run("CREATE TABLE IF NOT EXISTS saida (id INTEGER PRIMARY KEY AUTOINCREMENT, id_produto INTEGER, quantidade REAL, valor_unitario REAL, data_saida DATE)", (createTableError) => {


    if (createTableError) {
        return res.status(500).send({
            error: createTableError.message
        });
    }

    // O restante do código, se necessário...
});
// Rota para obter uma Entrada pelo ID
router.get("/:id", (req, res, next) => {
    const { id } = req.params;

    db.all("SELECT * FROM saida WHERE id=?", [id], (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }

        res.status(200).send({
            mensagem: "Aqui está a saida  solicitado",
            entrada: rows
        });
    });
});


// Rota para listar todos os entradas 
router.get("/", (req, res, next) => {
    db.all(`SELECT 
      saida.id as id,
      saida.quantidade as quantidade,
      saida.valor_unitario as valor_unitario,
      produto.descricao as descricao,
      produto.id as id_produto,
      saida.data_saida as data_saida
     FROM saida 

     INNER JOIN produto 
     ON saida.id_produto = produto.id;`, (error, rows) => {
        if (error) {
            return res.status(500).send({
                error: error.message
            });
        }
        res.status(200).send({
            mensagem: "Aqui está a lista de todas as Saída",
            produtos: rows
        });
    });
});
function atualizarestoque(id_produto, quantidade, valor_unitario) {
    db.all('SELECT * FROM estoque WHERE id_produto=?', [id_produto], (error, rows) => {
      if (error) {
        return false;
      }
      if (rows.length > 0) {
        let qtde = rows[0].quantidade;
        qtde=parseFloat(qtde) - parseFloat(quantidade);
        db.run("UPDATE estoque SET quantidade=?, valor_unitario=? WHERE id_produto=?",
          [qtde, valor_unitario, id_produto], (error) => {
            if (error) {
              return false
            }
          });
  
      } else {
        db.serialize(() => {
          const insertEstoque = db.prepare("INSERT INTO estoque(id_produto, quantidade, valor_unitario) VALUES(?,?,?)");
          insertEstoque.run(id_produto, quantidade, valor_unitario);
          insertEstoque.finalize();
        });
      }
    });
    return true;
  }

// Rota para criar um novo entradas 
router.post('/', (req, res, nxt) => {
    

console.log("passei aqui")
    const {id_produto , quantidade, valor_unitario,data_saida } = req.body;

    // Validação dos campos
    let msg = [];
    var regex = /^[0-9]+$/
    if (!id_produto) {
        console.log("error")
        msg.push({ mensagem: "id do produto inválido! Não pode ser vazio." });
    }
    console.log("erro")
    if (!quantidade || quantidade.length== 0) {
        
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

        // Insere o nova entradas  no banco de dados
        db.run(`INSERT INTO SAIDA ( id_produto, quantidade,valor_unitario,data_saida) VALUES (?,?,?,?)`,
            [id_produto, quantidade, valor_unitario, data_saida], function (insertError) {
                console.log(insertError)
                if (insertError) {
                    return res.status(500).send({
                        error: insertError.message,
                        response: null
                    });
                }
                atualizarestoque(id_produto, quantidade, valor_unitario)
                res.status(201).send({
                    mensagem: "saida criado com sucesso!",
                    entradas: {
                        id: this.lastID,
                        quantidade,
                        valor_unitario:valor_unitario,
                        data_saida
                    }
                });
            });
    });



// Rota para atualizar um entrada existente
router.put("/", (req, res, next) => {
    const { id, id_produto, quantidade, valor_unitario, data_saida } = req.body;

    if (!id_produto || !quantidade || !valor_unitario || !data_saida) {
        
        return res.status(400).send({ error: "Parâmetros inválidos" });
    }

    
    db.run("UPDATE ENTRADA SET id_produto=?, quantidade=?, valor_unitario=?,data_saida=? WHERE id=?", [id_produto, quantidade, valor_unitario, data_saida,id], (error) => {
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