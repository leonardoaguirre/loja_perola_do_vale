const Imagem = require('../models/imagem')


module.exports  = app=>{
    app.post('/imagem', (req,res)=>{
        const img = req.body

        Imagem.adiciona(img,res)
    })
}