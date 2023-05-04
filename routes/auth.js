const express = require('express');

const router = express.Router();

const authController = require('../controllers/authController');

const { check } = require('express-validator');

const auth = require('../middleware/auth');


router.post('/',
    [
        check('email','The email isnt correct').isEmail(),
        check('password', 'The password is required').not().isEmpty(),
    ],
    authController.userAuthentication
);

router.get('/',
    auth,
    authController.userAuthenticated
);

module.exports = router;