const query = require('../infra/database/queries')

class DAOCliente{
    adiciona(cliente){
        const sql = 'insert into cliente set ?'
        return query(sql,cliente)
    }
    lista(){
        const sql = 'select * from cliente'
        return query(sql)
    }
}
module.exports = new DAOCliente