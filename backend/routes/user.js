const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// route pour inscription
router.post('/signup', userCtrl.signup);

// route pour connexion
router.post('/login', userCtrl.login);

module.exports = router;
