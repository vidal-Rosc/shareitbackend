const express = require('express');

//Importamos la funcion de conexion a la BBDD
const connectionBBDD = require('./config/db');

//Nos permite conectar peticiones del front al backend
const cors = require('cors')

//lets get the server
const app = express();


//Realizamos la conexion a la BBDD
connectionBBDD();

//Habilitamos cors y de esta manera permitimos solo peticiones desde nuestro frontEND
const corsOptions = {
    origin: 'https://shareitbuddy.vercel.app',
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use( cors(corsOptions) );

//Message
console.log('Welcome to Share It. Initializing the Server....')

//Port
const port = process.env.PORT || 4000;

//Habilitamos la lectura de valores de un body
app.use( express.json());

//Habilitamos la carpeta publica
app.use( express.static('uploads'));


//Rutas de la app
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/links', require('./routes/links'));
app.use('/api/files', require('./routes/files'));




//starting the app
app.listen(port,'0.0.0.0', () => {
    console.log(`Server is fully operational on port ${port}`);
})