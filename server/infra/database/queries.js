const { rejects } = require('assert')
const conexao = require('./conexao')

const executaquery = (query, parametros = '') => {
    return new Promise((resolve, reject) => {
        return conexao.query(query, parametros, (erros, resultado, campos) => {
            if (erros) {
                reject(erros)
            } else {
                resolve(resultado)
            }
        })
    })

}
module.exports = executaquery