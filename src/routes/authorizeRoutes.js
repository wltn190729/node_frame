const router = require('express').Router()
const authController = require('../controllers/authorize.js');

router.post('/', authController.signIn);

router.post('/token-refresh', authController.accessTokenRefresh);

router.get('/user', authController.authenticateAccessToken);




module.exports = router;
