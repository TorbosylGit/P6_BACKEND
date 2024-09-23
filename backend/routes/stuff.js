const express = require('express'); // importer express
const router = express.Router(); // créer le routeur

// importer le contrôleur stuff
const stuffCtrl = require('../controllers/stuff');

// importer le middleware d'authentification
const auth = require('../middleware/auth');

// importer le middleware multer pour la gestion des fichiers
const multer = require('../middleware/multer-config');

// routes sécurisées pour les objets
router.post('/', auth, multer, stuffCtrl.createThing); // créer un objet
router.get('/:id', auth, stuffCtrl.getOneThing); // récupérer un objet par id
router.put('/:id', auth, multer, stuffCtrl.modifyThing); // modifier un objet
router.delete('/:id', auth, stuffCtrl.deleteThing); // supprimer un objet
router.get('/', auth, stuffCtrl.getAllThings); // récupérer tous les objets

// exporter le routeur
module.exports = router;
