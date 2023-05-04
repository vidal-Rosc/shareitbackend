//importamos el modelo
const  User = require('../model/User');

//importamos bcrypt para el hasheo de la password
const bcrypt = require('bcrypt');

const { validationResult} = require('express-validator');

exports.newUser = async (req, res) => {

    //Mostramos mensajes de error de la validacion
    const error = validationResult(req);
    if(!error.isEmpty()){
        return res.status(400).json({ error: error.array()});
    }


    //chequeamos si el usuario ya existe
    const { email, password } = req.body;
    
    let user = await User.findOne({ email });
    if(user){
        return res.status(400).json({msg: 'The email you are trying to use is already in our system'})
    }

    //Creamos el nuevo usuario
    user = new User(req.body);

    //Hasheamos el password
    const salt = await bcrypt.genSalt(11);
    user.password = await bcrypt.hash(password, salt);

    try {
        await user.save();
        res.json({msg: 'User created successfully'});    
    } catch (error) {
        console.log(error);
    } 
}
