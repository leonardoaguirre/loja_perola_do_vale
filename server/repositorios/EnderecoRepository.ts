import { validate } from 'class-validator';
import { EntityRepository , Repository} from 'typeorm';
import { Endereco } from '../models/Endereco';

@EntityRepository(Endereco)
class EnderecoRepository extends Repository<Endereco>{
    async validaDados(endereco:Endereco){
        return await validate(endereco);
    }
    async listaPorId(id:string){
        return await this.find({id_pessoa_fk : id});
    }
}
export {EnderecoRepository};