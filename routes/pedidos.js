const express = require('express')

//sistema de rotas do express
const router = express.Router()

//pedidos controller
const pedidosController = require('../controllers/pedidos-controller')

router.get('/', pedidosController.getPedidos)

router.get('/:id_pedido', pedidosController.getDetalhePedido)

router.post('/', pedidosController.postPedidos)

router.delete('/', pedidosController.deletePedido)

module.exports = router