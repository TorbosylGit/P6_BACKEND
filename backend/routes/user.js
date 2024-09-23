const express = require('express'); // importer express
const router = express.Router(); // créer le routeur
const rateLimit = require('express-rate-limit'); // importer express-rate-limit pour limiter les tentatives

// importer le contrôleur utilisateur
const userCtrl = require('../controllers/user');

// limiter les tentatives de connexion pour éviter les attaques par force brute
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // période de 15 minutes
    max: 5, // limiter à 5 tentatives par période
    message: 'trop de tentatives de connexion, réessayez dans 15 minutes.', // message pour l'utilisateur
});

// limiter les tentatives d'inscription pour éviter les abus
const signupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // période de 15 minutes
    max: 3, // limiter à 3 inscriptions par période
    message: "trop de tentatives d'inscription, réessayez dans 15 minutes.", // message pour l'utilisateur
});

// route pour inscription avec limitation
router.post('/signup', signupLimiter, userCtrl.signup); // inscription utilisateur

// route pour connexion avec limitation
router.post('/login', loginLimiter, userCtrl.login); // connexion utilisateur

// exporter le routeur
module.exports = router;
