//importando http
const http = require('http')

//var de ambiente ou porta 3000
const port = process.env.PORT || 3000

//importando o app
const app = require('./app')

//criando o servidor usando o app
const server = http.createServer(app)

//escutando a porta
server.listen(port)
