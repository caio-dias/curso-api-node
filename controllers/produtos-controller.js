const mysql = require('../mysql').pool

exports.getProdutos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: 'erro de conexao:' + error })}

        conn.query(
            'SELECT * FROM produtos',
            (error, result, field) => {
                conn.release()

                if(error) { return res.status(500).send({ error: error, response: null })}
                
                const response = {
                    quantidade: result.length,
                    produtos: result.map (produto => {
                        return {
                            id_produto: produto.id_produto,
                            nome: produto.nome,
                            preco: produto.preco,
                            imagem_produto: produto.imagem_produto,
                            request: {
                                tipo: 'GET',
                                descricao: 'retorna detalhe de um produto especifico.',
                                url: `http://localhost:3000/produtos/${produto.id_produto}`
                            }
                        }
                    })
                }

                res.status(200).send(response)
            }
        )
    })
}

exports.getProdutoDetalhe = (req, res, next) => {

    mysql.getConnection((error, conn) => {
        //erro em conexao
        if(error) { return res.status(500).send({ error: 'erro de conexao:' + error }) }

        conn.query(
            'SELECT * FROM produtos WHERE id_produto = ?;',
            [req.params.id_produto],
            (error, result, field) => {
                conn.release()

                if(error) { return res.status(500).send({ error: error, response: null })}

                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi possivel encontrar um produto com este ID.'
                    })
                }

                const response = {
                    produto: {
                        id_produto: result[0].id_produto,
                        nome: result[0].nome,
                        preco: result[0].preco,
                        imagem_produto: result[0].imagem_produto,
                        request: {
                            tipo: 'GET',
                            descricao: 'retorna todos os produtos.',
                            url: `http://localhost:3000/produtos`
                        }
                    }
                }

                res.status(200).send(response)
            }
        )
    })
}

exports.postProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        //erro em conexao
        if(error) { return res.status(500).send({ error: 'erro de conexao:' + error })}

        conn.query(
            'INSERT INTO produtos (nome, preco, imagem_produto) VALUES (?,?,?)',
            [req.body.nome, req.body.preco, req.file.path],
            (error, result, field) => {
                //sempre dar o release, para nao acumular o pool de conexoes
                conn.release()

                if(error) { return res.status(500).send({error: error, response: null })}

                const response = {
                    mensagem: 'Produto inserido com sucesso!',
                    produto: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        imagem_produto: req.file.path,
                        request: {
                            tipo: 'GET',
                            descricao: 'retorna todos os produtos.',
                            url: `http://localhost:3000/produtos`
                        }
                    }
                }

                res.status(201).send(response)
            }
        )
    })
}

exports.patchProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        //erro em conexao
        if(error) { return res.status(500).send({ error: 'erro de conexao:' + error })}

        conn.query(
            'UPDATE produtos SET nome = ?, preco = ? WHERE id_produto = ?',
            [req.body.nome, req.body.preco, req.body.id_produto],
            (error, result, field) => {
                //sempre dar o release, para nao acumular o pool de conexoes
                conn.release()

                if(error) { return res.status(500).send({error: error, response: null })}

                const response = {
                    mensagem: 'Produto alterado com sucesso!',
                    produto: {
                        id_produto: result.id_produto,
                        nome: req.body.nome,
                        preco: req.body.preco,
                        request: {
                            tipo: 'GET',
                            descricao: 'retorna detalhe do produto alterado.',
                            url: `http://localhost:3000/produtos/${req.body.id_produto}`
                        }
                    }
                }

                res.status(200).send(response)
            }
        )
    })
}

exports.deleteProduto = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        //erro em conexao
        if(error) { return res.status(500).send({ error: 'erro de conexao:' + error })}

        conn.query(
            'DELETE FROM produtos WHERE id_produto = ?',
            [req.body.id_produto],
            (error, result, field) => {
                //sempre dar o release, para nao acumular o pool de conexoes
                conn.release()

                if(error) { return res.status(500).send({error: error, response: null })}

                const response = {
                    mensagem: 'produto deletado com sucesso!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um produto',
                        url: 'http://localhost:3000/produtos',
                        body: {
                            "nome": "String",
                            "preco": "Number"
                        }
                    }
                }

                res.status(200).send(response)
            }
        )
    })
}