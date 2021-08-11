const express = require('express')

//sistema de rotas do express
const router = express.Router()

//controller usuarios
const usuariosController = require('../controllers/usuarios-controller')

router.post('/cadastro', usuariosController.usuarioCadastro)

router.post('/login', usuariosController.usuarioLogin)

module.exports = router