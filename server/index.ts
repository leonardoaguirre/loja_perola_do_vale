<<<<<<< HEAD
import { Connection, createConnection } from "typeorm";
=======
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
>>>>>>> parent of 2abfcdd9 (Revert "Merge branch 'hideki_updates' of https://github.com/HidekiYamakawa/loja_perola_do_vale into hideki_updates")

export default async (): Promise<Connection> => {


return await createConnection();

};
