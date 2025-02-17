const express = require('express');
const oauthController = require('../controllers/oauthController');
const {validateGoogleOAuth}= require('../middlewares/validationMiddleware');

const router = express.Router();

router.post('/google', validateGoogleOAuth, oauthController.googleSignIn);


module.exports = router;
