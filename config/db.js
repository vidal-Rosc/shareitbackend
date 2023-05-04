const mongoose = require('mongoose');

require('dotenv').config({ path: 'variables.env'});

//Conectamos a la BBDD
const connectionBBDD = async () => {
    try {
       await mongoose.connect( process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true,

       }); 
       console.log('Initializing Database connection....');
       console.log('Connection with Database established... OK');
    } catch (error) {
        console.log('Connection failed');
        console.log(error);
        process.exit(1);
    }
}

module.exports = connectionBBDD;