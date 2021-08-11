const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')

const rotaProdutos = require('./routes/produtos')
const rotaPedidos = require('./routes/pedidos')
const rotaUsuarios = require('./routes/usuarios')

//logs do morgans em dev
app.use(morgan('dev'))

//rota de imagens publica
app.use('/uploads', express.static('uploads'))

//aceitando apenas dados simples (json)
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//tratamento de CORS
app.use((req, res, next) => {
    //quem pode acessar a api, * = todos
    res.header('Access-Control-Allow-Origin', '*')

    //tipos de header que a api pode receber
    res.header(
        'Access-Control-Allow-Header',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    )
    
    //metodos que a api aceita
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).send({})
    }

    next()
})

app.use('/produtos', rotaProdutos)
app.use('/pedidos', rotaPedidos)
app.use('/usuarios', rotaUsuarios)

// tratamento de erros, quando acessa uma pagina inexistente
app.use((req, res, next) => {
    const erro = new Error('Página não encontrada!')
    erro.status = 404

    //joga para o proximo app.use
    next(erro)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    })
})

module.exports = app