//Importamos el modelo
const Link = require('../model/Link');

const shortId = require('shortid');

const bcrypt = require('bcrypt');

const { validationResult} = require('express-validator');



exports.newLink = async (req, res, next) => {
    console.log('Desde nuevo enlace');

    //Mostramos mensajes de error de la validacion
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({ error: error.array()});
    }

    //Creamos el objeto enlace
    const { original_name, name } = req.body;

    const link = new Link();
    link.url = shortId.generate();
    link.name = name;
    link.original_name = original_name;
    

    //Revisamos que el usuario este autenticado
    console.log(req.user);
    if(req.user){
        const { password, downloads } = req.body;
        link.password = password;

        //Asignamos al enlace el numero  de descargas
        if(downloads){
            link.downloads = downloads;
        }

        //Asigamos una contrasenia
        if(password){
            try {
                const salt = await bcrypt.genSalt(11);
                link.password = await bcrypt.hash( password, salt);      
            } catch (error) {
               console.log(error) 
            }
        }

        //Asignamos el Author
        link.author = req.user.id;

        
    }

    //Almacenamos en la BBDD
    try {
        await link.save();
        return res.json({ msg: `${link.url}`});
        next();
    } catch (error) {
        console.log(error);
    }

    console.log(link);
}

//Obtenemos un listado de todas las urls de los links que existen y le quitamos el ID
exports.getAllLinks = async (req, res) => {

    try {
        const allLinks = await Link.find({}).select('url -_id');
        res.json({allLinks});

    } catch (error) {
        console.log(error)
    }

}

exports.gotLinkPassword = async (req, res, next) => {
    //Chequeamos si existe el enlace
    const { url } = req.params;
    const link =  await Link.findOne({url});

    if(!link){
        res.status(404).json({msg: 'This link doesnt exist'});
        return next();
    }
    console.log(link);

    if(link.password){
        return res.json({password: true, link: link.url});
    }
    next();
    
}

exports.confirmPassword = async (req, res, next) => {
    console.log('Confirming the password');
    //console.log(req.params);
    const { url } = req.params;

    //console.log(req.body)
    const {password } = req.body;

    //Consultamos por el  enlace
    const link =  await Link.findOne({url});

    //Verificamos el password
    if(bcrypt.compareSync(password, link.password )){
        //Permitimos descargar el archivo
        next()
    }else {
        return res.status(401).json({msg: 'Password incorrect'})
    }

   
}

exports.getLinks = async (req, res, next) => {
    //console.log(req.params.url);

    const { url } = req.params;

    console.log(url)

    //Chequeamos si no existe el enlace
    const link =  await Link.findOne({url});

    if(!link){
        res.status(404).json({msg: 'This link doesnt exist'});
        return next();
    }
    console.log(link);

    //Si el enlace existe
    res.json({file: link.name, password: false});

    next();

}


