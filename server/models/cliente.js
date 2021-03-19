const { rejects } = require('assert')
const { json } = require('body-parser')
const { resolve } = require('path')
const conexao = require('../infra/database/conexao')
const Pessoa = require('./Pessoa.ts')
const repositorio = require('../repositorios/DAOCliente')

class Cliente {
    constructor() {
        this.validacoes = [
            {
                nome: 'data',
                valido: this.dataEhValida,
                mensagem: 'A pessoa deve ser maior de idade'
            },
            {
                nome: 'nome',
                valido: this.clienteEhValido,
                mensagem: 'O nome deve conter mais de cinco caracteres'
            }
        ]
        this.dataEhValida = (data) => moment(data).fromNow() >= 18
        this.clienteEhValido = (tamanho) => tamanho >= 5
    }

    adicionaCliente(cliente, res, idpessoa) {
        const sql = 'insert into cliente set login=?, senha=?, idPessoa_fk=?'
        console.log(cliente)
        conexao.query(sql, [cliente.login, cliente.senha, idpessoa], (erro, resultado) => {
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(resultado)
            }
        })
    }
    adicionapessoa(pessoa, res) {

        /*const dataCriacao = moment().format('YYYY-MM-DD HH:MM:SS')
        const data = moment(pessoa.dtNasc, 'DD/MM/YYYY').format('YYYY-MM-DD')

       


        const erros = validacoes.filter(campo => !campo.valido)
        const existemErros = erros.length*/
        const existemErros = 0

        if (existemErros) {
            return new Promise((resolve, reject) => reject(erros))
            //res.status(400).jsonn(erros)
        } else {
            //pessoa.dtNasc = data

            return repositorio.adiciona(pessoa)
                .then(resultado => {
                    const id = resultado.insertId
                    return { ...pessoa, id }
                })
            // conexao.query(sql, [pessoa.nome, pessoa.cpf], (erro, resultado) => {
            //     if (erro) {
            //         res.status(400).json(erro)

            //     } else {

            //          this.adicionaCliente(pessoa,res, parseInt(resultado.insertId))

            //     }
            // })
        }
    }
    lista() {
        return repositorio.lista()
    }
    buscaPorId(id, res) {
        const sql = `select * from cliente where idCliente=${id}`
        conexao.query(sql, (erro, resultado) => {
            const cliente = resultado[0]
            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(cliente)
            }
        })
    }
    altera(id, valores, res) {
        const sql = 'update cliente set ? where idCliente=?'

        conexao.query(sql, [valores, id], (erro, resultado) => {

            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(resultado)
            }
        })
    }
    deleta(id, res) {
        const sql = `delete from cliente where idCliente=?`
        conexao.query(sql, id, (erro, resultado) => {

            if (erro) {
                res.status(400).json(erro)
            } else {
                res.status(201).json(resultado, id)
            }
        })
    }
}
module.exports = new Cliente