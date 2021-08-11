const mysql = require('../mysql').pool

exports.getPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: 'erro de conexao:' + error })}

        conn.query(
            'SELECT pedidos.id_pedido, pedidos.quantidade, produtos.id_produto, produtos.nome, produtos.preco FROM pedidos INNER JOIN produtos ON produtos.id_produto = pedidos.id_produto;',
            (error, result, field) => {
                conn.release()

                if(error) { return res.status(500).send({ error: error, response: null })}
                
                const response = {
                    quantidade_de_pedidos: result.length,
                    pedidos: result.map (pedido => {
                        return {
                            id_pedido: pedido.id_pedido,
                            quantidade_de_produtos: pedido.quantidade,
                            produto: {
                                id_produto: pedido.id_produto,
                                nome: pedido.nome,
                                preco: pedido.preco
                            },
                            request: {
                                tipo: 'GET',
                                descricao: 'retorna detalhe de um pedido especifico.',
                                url: `http://localhost:3000/pedidos/${pedido.id_pedido}`
                            }
                        }
                    })
                }

                res.status(200).send(response)
            }
        )
    })
}

exports.getDetalhePedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        //erro em conexao
        if(error) { return res.status(500).send({ error: 'erro de conexao:' + error })}

        conn.query(
            'SELECT * FROM pedidos WHERE id_pedido = ?;',
            [req.params.id_pedido],
            (error, result, field) => {
                conn.release()

                if(error) { return res.status(500).send({ error: error, response: null })}

                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi possivel encontrar um pedido com este ID.'
                    })
                }

                const response = {
                    pedido: {
                        id_pedido: result[0].id_pedido,
                        id_produto: result[0].id_produto,
                        quantidade: result[0].quantidade,
                        request: {
                            tipo: 'GET',
                            descricao: 'retorna todos os pedidos.',
                            url: `http://localhost:3000/pedidos`
                        }
                    }
                }

                res.status(200).send(response)
            }
        )
    })
}

exports.postPedidos = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if(error) { return res.status(500).send({ error: 'erro de conexao:' + error })}

        conn.query(
            'SELECT * FROM produtos WHERE id_produto =?',
            [req.body.id_produto],
            (error, result, field) => {
                if(error) { return res.status(500).send({error: error, response: null })}

                //se o id_produto nao existir, retorna 404 e sai da funcao
                if(result.length == 0) {
                    return res.status(404).send({
                        mensagem: 'Não foi possivel encontrar um produto com este ID.'
                    })
                }

                conn.query(
                    'INSERT INTO pedidos (id_produto, quantidade) VALUES (?,?)',
                    [req.body.id_produto, req.body.quantidade],
                    (error, result, field) => {
                        //sempre dar o release, para nao acumular o pool de conexoes
                        conn.release()
        
                        if(error) { return res.status(500).send({error: error, response: null })}
        
                        const response = {
                            mensagem: 'pedido inserido com sucesso!',
                            pedido: {
                                id_pedido: result.insertId,
                                id_produto: req.body.id_produto,
                                quantidade: req.body.quantidade,
                                request: {
                                    tipo: 'GET',
                                    descricao: 'retorna todos os pedidos.',
                                    url: `http://localhost:3000/pedidos`
                                }
                            }
                        }
        
                        res.status(201).send(response)
                    }
                )
            }
        )  
    })
}

exports.deletePedido = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        //erro em conexao
        if(error) { return res.status(500).send({ error: 'erro de conexao:' + error })}

        conn.query(
            'DELETE FROM pedidos WHERE id_pedido = ?',
            [req.body.id_pedido],
            (error, result, field) => {
                //sempre dar o release, para nao acumular o pool de conexoes
                conn.release()

                if(error) { return res.status(500).send({error: error, response: null })}

                const response = {
                    mensagem: 'pedido deletado com sucesso!',
                    request: {
                        tipo: 'POST',
                        descricao: 'Insere um pedido',
                        url: 'http://localhost:3000/pedidos',
                        body: {
                            "id_produto": "Number",
                            "quantidade": "Number"
                        }
                    }
                }

                res.status(200).send(response)
            }
        )
    })
}