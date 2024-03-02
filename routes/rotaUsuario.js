const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

const usuario = [
  {
    id: 1,
    nome: "Bleno",
    email: "bleno@gmail.com",
    senha: "123",
  },
  {
    id: 2,
    nome: "felipe",
    email: "felipe@gmail.com",
    senha: "123",
  },
  {
    id: 3,
    nome: "nero",
    email: "nero@gmail.com",
    senha: "123",
  },
  {
    id: 4,
    nome: "carlinhos",
    email: "carlinhos@gmail.com",
    senha: "123",
  }


]
router.get("/:id", (req, res, next) => {
  const {id}= req.params;
  db.all("SELECT * FROM usuario WHERE id=?",[id], (error, rows) => {
    if (error) {
      return res.status(500).send({
        error: error.message

      });
    }
    res.status(200).send({
      mensagem: "Aqui está a lista de usuarios",
      usuario: rows

    })

  })


});
router.get("/", (req, res, next) => {
  db.all("SELECT * FROM usuario", (error, rows) => {
    if (error) {
      return res.status(500).send({
        error: error.message

      });
    }
    res.status(200).send({
      mensagem: "Aqui está a lista de usuarios",
      usuarios: rows

    })

  })


});
router.post("/login", (req, res, next) => {
  const { email,senha } = req.body
  console.log(email)
  console.log(senha)
  db.all("SELECT * FROM usuario WHERE email=? and senha=?",[email,senha],(error, rows) => {
    if (error) {
      return res.status(500).send({
        error: error.message

      });
    }
    res.status(200).send({
      mensagem: "Dados de login estao corretos",
      usuarios: rows

    })

  })


});
router.get("/nomes", (req, res, next) => {
  let nomes = [];
  usuario.map((linha) => {
    nomes.push({
      nome: linha.nome,
      email: linha.email
    })
  })

  res.json(nomes)
})
router.post("/", (req, res, next) => {
  const { nome, email, senha } = req.body;


  db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS usuario(id INTEGER PRIMARY KEY AUTOINCREMENT, nome text , email TEXT UNIQUE, senha TEXT)")
    const inserUsuario = db.prepare("INSERT INTO usuario(nome,email,senha)VALUES(?,?,?)")
    inserUsuario.run(nome, email, senha);
    inserUsuario.finalize();


  })

  process.on("SIGINT", () => {
    db.close((err) => {
      if (err) {
        return res.status(304).send(err.message);
      }
    })
  })


  res.status(200).send({ mensagem: "Salva com Sucesso" });

});

router.put("/", (req, res, next) => {
  const { id, nome, email, senha } = req.body;
  db.run("UPDATE usuario SET nome=?,email=?,senha=? WHERE id=?",
    [nome, email, senha, id], function (error) {
      if (error) {
        return res.status(500).send({
          error: error.message

        });
      }
      res.status(200).send({
        mensagem: "Cadastro Alterado com Sucesso!",


      })

    })

})

router.delete("/:id", (req, res, next) => {
  const { id } = req.params;
  db.run("DELETE FROM usuario WHERE id= ?", id, (error,) => {
    if (error) {
      return res.status(500).send({
        error: error.message

      });

    }
    res.status(200).send({
      mensagem: "Cadastro deletado com sucesso!!"
    })
  });

});
module.exports = router;