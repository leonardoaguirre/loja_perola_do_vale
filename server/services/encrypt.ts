import bcrypt from 'bcrypt';
//import crypt from 'crypto';

class Encrypt {
    async execute(senha: string) {
        const hash = await bcrypt.hash(senha, 10).then((res)=>{
            return res;
        })
        
        return hash;
    }
    async validate(senha : string , hash : string){
        const res = bcrypt.compare(senha,hash).then((result)=>{
            return result;
        })
        return res;
    }
}
export { Encrypt };