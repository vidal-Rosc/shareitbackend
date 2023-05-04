const express = require('express');

const router = express.Router();

const linkController = require('../controllers/linkController');

const filesController = require('../controllers/filesController');

const { check } = require('express-validator');

const auth = require('../middleware/auth');

//Creamos usuarios
router.post('/',
    [
        check('name', 'Upload a file').not().isEmpty(),
        check('original_name', 'Upload a file').not().isEmpty()
    ],
    auth,
    linkController.newLink
);

router.get('/',
    linkController.getAllLinks
);


router.get('/:url',
    linkController.gotLinkPassword,
    linkController.getLinks,
);

router.post('/:url',
    linkController.confirmPassword,
    linkController.getLinks
)
module.exports = router;