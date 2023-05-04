//importamos el modelo
const User = require('../model/User');

//importamos bcrypt para el hasheo de la password y poder compararla
const bcrypt = require('bcrypt');

//importamos JWT
const jwt = require('jsonwebtoken');

//Importamos la palabra secreta(variable)
require('dotenv').config({ path: 'variables.env'});

const { validationResult} = require('express-validator');


exports.userAuthentication = async (req, res) => {

    //Mostramos mensajes de error de la validacion
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({ error: error.array()});
    }

    //Revisamos si el usuario ya existe
    const { email, password } = req.body;

    const user =  await User.findOne({ email });
    console.log(user);
    if(!user){
        res.status(401).json({msg: 'This user does NOT exist'});
        return next();
    }

    //Si el usuario existe, verificamos password y autenticamos
    if(bcrypt.compareSync(password, user.password)){
        console.log('password correct');

        //Creamos un JWT
        const token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email

        }, process.env.SECRET, {
            expiresIn: '8h'
        } );

        //console.log(token);
        res.json({token});

    } else {
        console.log('password incorrect');
        res.status(401).json({msg: 'Password incorrect. Try again.'});
    }


}

exports.userAuthenticated = async (req, res ) => {
    res.json({user: req.user});
}