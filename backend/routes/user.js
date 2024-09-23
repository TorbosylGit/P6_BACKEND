const express = require('express'); // importer express
const router = express.Router(); // créer le routeur

// importer le contrôleur utilisateur
const userCtrl = require('../controllers/user');

// route pour inscription avec limitation
router.post('/signup', userCtrl.signup); // inscription utilisateur

// route pour connexion avec limitation
router.post('/login', userCtrl.login); // connexion utilisateur

// exporter le routeur
module.exports = router;
