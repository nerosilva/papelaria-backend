const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');



//criacao de tabela de saida no banco de dados caso ja existe
db.run("CREATE TABLE IF NOT EXISTS produto (id INTEGER PRIMARY KEY AUTOINCREMENT, status TEXT, descricao TEXT, estoque_minimo REAL, estoque_maximo REAL)", (createTableError) => {

  if (createTableError) {
    return res.status(500).send({
      error: createTableError.message
    });
  }

  // O restante do código, se necessário...
});


const produto = [
  {

    status: "A",
    descricao: "Caneta azul",
    estoque_minimo: "5",
    estoque_maximo: "8",
  },
  {

    status: "B",
    descricao: "lapis",
    estoque_minimo: "5",
    estoque_maximo: "10",
  },
  {

    status: "C",
    descricao: "Caderno",
    estoque_minimo: "5",
    estoque_maximo: "15",
  },
  {

    status: "D",
    descricao: "Borracha",
    estoque_minimo: "5",
    estoque_maximo: "20",
  }


]

router.get("/", (req, res, next) => {
  db.all("SELECT * FROM produto", (error, rows) => {
    if (error) {
      return res.status(500).send({
        error: error.message

      });
    }
    res.status(200).send({
      mensagem: "Aqui está a lista de produtos",
      produtos: rows

    })

  })

});

router.get("/:id", (req, res, next) => {
  const {id}= req.params
  db.all("SELECT * FROM produto WHERE id=?",[id], (error, rows) => {
    if (error) {
      return res.status(500).send({
        error: error.message

      });
    }
    
    res.status(200).send({
      mensagem: "Aqui está a lista de produtos",
      produto: rows

    })

  })

});


router.post('/', (req, res, next) => {
  db.run("CREATE TABLE IF NOT EXISTS produto (id INTEGER PRIMARY KEY AUTOINCREMENT, status TEXT, descricao TEXT, estoque_minimo REAL, estoque_maximo REAL)", (createTableError) => {
    if (createTableError) {
        return res.status(500).send({
            error: createTableError.message
        });
    }
  })
  const { status, descricao, estoque_minimo, estoque_maximo } = req.body;

  // Validação dos campos
  let msg = [];
  if (!status) {
    msg.push({ mensagem: "status inválido! Deve ter pelo menos 1 caracteres." });
  }
  if (!descricao) {
    msg.push({ mensagem: "descriçao inválido!" });
  }
  if (!estoque_minimo) {
    msg.push({ mensagem: "estoque_minimo inválida! Deve ter pelo menos 6 caracteres." });
  }
  if (!estoque_minimo) {
    msg.push({ mensagem: "estoque_maximo Deve ter pelo menos 20 caracteres." });
  }

  if (msg.length > 0) {
    console.log("Falha ao cadastrar produto")
    return res.status(400).send({
      mensagem: "Falha ao cadastrar produto.",
      erros: msg
    });
  }

  // Verifica se o email já está cadastrado
  db.get(`SELECT * FROM produto WHERE descricao = ?`, [descricao], (error, produtoExistente) => {
    if (error) {
      return res.status(500).send({
        error: error.message,
        response: null
      });
    }

    if (produtoExistente) {
      console.log("produto já cadastrado")
      return res.status(400).send({
        mensagem: "produto já cadastrado."
      });
    }

    // Hash da senha antes de salvar no banco de dados
    //bcrypt.hash(senha, 10, (hashError, hashedPassword) => {
      //if (hashError) {
       // return res.status(500).send({
          //error: hashError.message,
         // response: null
       // });
      //}

      // Insere o novo usuário no banco de dados
      db.run(`INSERT INTO produto (status, descricao, estoque_minimo,estoque_maximo) VALUES (?, ?, ?,?)`, [status, descricao, estoque_minimo, estoque_maximo ], function (insertError) {
        console.log(insertError)
        if (insertError) {
          return res.status(500).send({
            error: insertError.message,
            response: null
          });
        }
        res.status(201).send({
          mensagem: "Produto cadastrado com sucesso!",
          produto: {
            id: this.lastID,
            status: status,
            descricao: descricao,
            estoque_minimo: estoque_minimo,
            estoque_maximo: estoque_maximo,
          }
        });
      });
    });
  });


// Função para validar formato de e-mail
// function validateEmail(email) {
//   const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return re.test(String(email).toLowerCase());
// }

//responsável por salvar alterações de um cadastro já existente no banco de dados
router.put("/", (req, res, next) => {
  const {id, status, descricao, estoque_minimo, estoque_maximo } = req.body;
  db.run("UPDATE produto SET status=?,descricao=?,estoque_minimo=?,estoque_maximo=? WHERE id=?",
    [status, descricao, estoque_minimo, estoque_maximo,id], function (error) {
      if (error) {
        return res.status(500).send({
          error: error.message

        });
      }
      res.status(200).send({
        mensagem: "Produto Alterado com Sucesso!",


      })

    })

})

router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  db.run("DELETE FROM produto WHERE id= ?", id, (error,) => {
    if (error) {
      return res.status(500).send({
        error: error.message

      });

    }
    res.status(200).send({
      mensagem: "Produto deletado com sucesso!!"
    })
  });

});
module.exports = router;