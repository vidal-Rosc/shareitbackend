//Importamos la palabra secreta(variable)
require('dotenv').config({ path: 'variables.env'});

//importamos JWT
const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

    //console.log(req.get('Authorization'));
    const authHeader = req.get('Authorization');
    if(authHeader){
        //Obtenemos el token
        const token = authHeader.split(' ')[1];

        //Comprobar el JWT
        try {
            const user = jwt.verify(token, process.env.SECRET);
            req.user = user;

        } catch (error) {
            console.log(error);
            console.log('JWT not valid');
        }
    } 
    return next();
}