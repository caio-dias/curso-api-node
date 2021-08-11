const express = require('express')

//sistema de rotas do express
const router = express.Router()

//upload de imagens
const multer = require('multer')
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        cb(null, new Date().toISOString() + '-' + file.originalname)
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer(
    {
        storage: storage ,
        limits: {
            fileSize: 1024 * 1024 * 5
        },
        fileFilter: fileFilter
    }
)

//autenticacao de usuario
const verificaLogin = require('../middlewares/login')

//produtos controller
const produtosController = require('../controllers/produtos-controller')

router.get('/', produtosController.getProdutos)

router.get('/:id_produto', produtosController.getProdutoDetalhe)

router.post('/', verificaLogin.obrigatorio, upload.single('produto_imagem'), produtosController.postProduto)

router.patch('/', verificaLogin.obrigatorio, produtosController.patchProduto)

router.delete('/', verificaLogin.obrigatorio, produtosController.deleteProduto)

module.exports = router