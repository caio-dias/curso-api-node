//conexao com o banco
const mysql = require('../mysql').pool

//usada para criptografar a senha
const bcrypt = require('bcrypt')

//json web token
const jwt = require('jsonwebtoken')

exports.usuarioCadastro = (req, res, netx) => {
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error })}
        
        conn.query('SELECT * FROM usuarios WHERE email = ?',
        [req.body.email],
        (error, result) => {
            if (error) {return res.status(500).send({ error: error })}
            
            if(result.length > 0) {
                conn.release()
                return res.status(409).send({ mensagem: 'usuario ja cadastrado, use outro email' })
            } else {
                /**
                 * 1 senha digitada
                 * 2 salt garante seguranca por jogar (10) caracteres aleatorios na senha que o user digitar
                 * 3 callback que recebe o erro e a hash gerada
                 */
                bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
                    if(errBcrypt) {return res.status(500).send({ error: errBcrypt })}
                    conn.query('INSERT INTO usuarios (email, senha) VALUES (?, ?)',
                    [req.body.email, hash],
                    (error, result, fields) => {
                        conn.release()
                        if (error) {return res.status(500).send({ error: error })}
                        
                        const response = {
                            mensagem: 'usuario criado com sucesso',
                            usuario: {
                                id_usuario: result.insertId,
                                email: req.body.email
                            }
                        }
        
                        return res.status(201).send(response)
                    })
                })
            }
        })

    })
}

exports.usuarioLogin = (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {return res.status(500).send({ error: error })}

        conn.query('SELECT * FROM usuarios WHERE email = ?',
        [req.body.email],
        (error, result, fields) => {
            conn.release()
            if (error) {return res.status(500).send({ error: error })}
            
            if (result.length < 1) {return res.status(401).send({mensagem: 'falha na autenticacao'})}
            
            const id_result = result[0].id_usuario || null
            const email_result = result[0].email || null

            //comparando a senha digitada com a salva no banco
            bcrypt.compare(req.body.senha, result[0].senha, (error, result) => {
                if (result.length < 1) {return res.status(401).send({mensagem: 'falha na autenticacao'})}
                
                if (result) {
                    // jwt config
                    //payload ao gerar token
                    const token = jwt.sign({
                        id_usuario: id_result,
                        email: email_result
                    },
                    //chave privada
                    process.env.JWT_KEY,
                    //expiracao do login
                    {
                        expiresIn: "1h"
                    })
                    
                    return res.status(200).send({
                        mensagem: 'autenticado com sucesso',
                        token: token
                    })
                }
                return res.status(401).send({mensagem: 'falha na autenticacao'})

            })
        })
    })
}