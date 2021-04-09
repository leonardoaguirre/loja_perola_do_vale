// const customExpress = require('./config/customExpress')
// const conexao = require('./infra/database/conexao')


// conexao.connect(erro => {
//     if (erro) {
//         console.log(erro)
//     } else {
//         console.log('conectado com sucesso!')
//         const app = customExpress()
//         app.listen(3000, () => console.log('servidor rodando na porta 3000'))
//     }
// })

import { Connection, createConnection, getConnectionOptions } from "typeorm";

export default async (): Promise<Connection> => {


return await createConnection();

};
