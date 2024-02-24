const express = require("express");
const router = express.Router();
const usuario =[
    {
    id:1,
    nome:"Bleno",
    email:"bleno@gmail.com",
    senha:"123",
    },
    {
    id:2,
    nome:"felipe",
    email:"felipe@gmail.com",
    senha:"123",
    },
    {
    id:3,
    nome:"nero",
    email:"nero@gmail.com",
    senha:"123",
    },
    {
    id:4,
    nome:"carlinhos",
    email:"carlinhos@gmail.com",
    senha:"123",
    }

    
]
router.get("/",(req,res,next)=>{
    res.json(usuario)
})
router.get("/nomes",(req,res,next)=>{
    let nomes=[];
    usuario.map((linha)=>{
       nomes.push({
         nome:linha.nome,
         email:linha.email
       })
    })

    res.json(nomes)
})
router.post("/",(req,res,next)=>{
    const id = req.body.id;
    const nome = req.body.nome;

  res.send(
    {
    id:id,
    nome:nome
});
});
router.put("/",(req,res,next)=>{
    const id = req.body.id;

  res.send({id:id});
})
router.delete("/:id",(req,res,next)=>{
    const {id} = req.params;

  res.send({id:id});
})
module.exports = router;