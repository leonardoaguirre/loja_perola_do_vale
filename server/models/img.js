// const conexao = require('../infra/database/conexao')
// const UploadDeArqivo = require('../infra/arquivos/uploadDeArquivos')

// class Imagem {

//     adiciona(imagem, res) {
//         const sql = 'insert into imagem set ?'

//         UploadDeArqivo(imagem.img, imagem.nome, (erro, novoCaminho) => {

//             if (erro) {
//                 res.status(400).json({erro})
//             } else {
//                 const novaImg = { nome: imagem.nome, img: novoCaminho }

//                 conexao.query(sql, novaImg, erro => {
//                     if (erro) {
//                         res.status(400).json(erro)
//                     } else {
//                         res.status(201).json(novaImg)
//                     }
//                 })
//             }

//         })

//     }
// }
// module.exports = new Imagem