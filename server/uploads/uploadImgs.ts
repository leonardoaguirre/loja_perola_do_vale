import multer from 'multer';
import crypto from 'crypto';
import fs from 'fs';
import {Request} from 'express';

const upload = multer({
    storage: multer.diskStorage({
        destination: (req : Request , file, cb) => {
            const {codBarra} = req.body;
            
            const dir = 'uploads/imgs/'+codBarra;
            if(!fs.existsSync(dir)){
                fs.mkdirSync(dir);
            }
            cb(null, dir/* + crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err, null);
                cb(null, hash.toString(`hex`));
            })*/
            )
        },
        filename: (req, file, cb) => {
            crypto.randomBytes(16, (err, hash) => {
                if (err) cb(err, null);

                const filename = `${hash.toString(`hex`)}-${file.originalname}`;

                cb(null, filename);
            })
        },
        
    }),
    limits: {
        fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req , file, cb) => {
        const tipos = ['image/jpeg', 'image/png', 'image/jpg'];
        if (tipos.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error('Imagem com extensão invalida!'));
        }
    }
})
export { upload };
