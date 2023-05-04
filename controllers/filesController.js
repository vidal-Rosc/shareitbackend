const multer = require('multer');

const shortId = require('shortid');

const fs = require('fs');

const Link = require('../model/Link');
const { request } = require('http');




exports.uploadFile = async (req, res, next ) => {

    const multerConfig = {
        limits : { fileSize:  req.user ? 1024 * 1024 * 10  : 1024 * 1024 },
        storage:  fileStorage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, __dirname+'/../uploads')
            },
            filename: (req, file, cb) => {
                const extension = file.originalname.substring(file.originalname.lastIndexOf('.'), file.originalname.length);
                cb(null, `${shortId.generate()}${extension}`);
            },
        })
    }

    const upload = multer(multerConfig).single('file');
    
    upload(req, res, async(error)  => {
        console.log(req.file);
        if(!error){
            res.json({file: req.file.filename});
        } else {
            console.log(error);
            return next();
        }
    });
    
}


exports.deleteFile = async ( req, res ) => {
    console.log(req.file);
    try {
        //Unlink permite eliminar un archivo del sistema operativo.
        fs.unlinkSync(__dirname +`/../uploads/${req.file}`);
        console.log('file deleted');
    } catch (error) {
        console.error(error);
    }
}

exports.downloading = async (req, res, next ) => {

    try {
        //Obtiene el enlace
        const { file } = req.params;
        console.log(req.params.file);

        console.log(file);
        const link = await Link.findOne({name: file });

        const fileDownload = __dirname + '/../uploads/' + file;

        
        res.download(fileDownload);

        //Eliminamos el file y la entrada en la BBDD
        //Si download = 1  borrar entrada y el file
        const { downloads, name } = link;

        if(downloads === 1){
            //Eliminamos el archivo
            req.file = name;
       
            //Lo eliminamos de la BBDD
            await Link.findOneAndRemove(link.id);
            next();
        } else {
            //Si download > 1  borrar 1
            link.downloads--;
            await link.save();
        }
        
    } catch (error) {
       console.log('there was an error!!');
    } 
}