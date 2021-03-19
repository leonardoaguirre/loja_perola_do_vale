const Cliente = require('../models/cliente')
const Pessoa = require('../models/pessoa')

module.exports = app => {
    app.get('/ControleCliente', (req, res) => {
        Cliente.lista()
        .then(resultados => res.json(resultados))
        .catch(erros => req.status(400).json(erros))

    })
    app.get('/ControleCliente/:idCliente', (req, res) => {
        const id = parseInt(req.params.idCliente)

        Cliente.buscaPorId(id, res)

    })
    app.post('/ControleCliente', (req, res) => {
        console.log(req.body)

        const cliente = req.body

        Cliente.adicionapessoa(cliente)
        .then(clienteCadastrado => 
            res.status(201).json(clienteCadastrado)
            )
            .catch(erros => res.status(400).json(erros))
        //Cliente.adiciona(cliente, res, Pessoa.idpessoa)
    })
    app.patch('/ControleCliente/:idCliente', (req, res) => {
        const id = parseInt(req.params.idCliente)
        const valores = req.body

        Cliente.altera(id, valores, res)
    })
    app.delete('/ControleCliente/:idCliente', (req, res) => {
        const id = parseInt(req.params.idCliente)
        const valores = req.body

        Cliente.deleta(id, res)
    })
}
