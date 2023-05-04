const express = require('express');

const router = express.Router();

const userController = require('../controllers/userController');

const { check } = require('express-validator');

//Creamos usuarios
router.post('/',
    [
        check('name', 'The name is required').not().isEmpty(),
        check('email','The email isnt correct').isEmail(),
        check('password', 'The password should have at least 6 characters').isLength({min: 6})
    ],
    userController.newUser
);

module.exports = router;