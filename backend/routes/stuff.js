const express = require('express');
const router = express.Router();

// importer le contrôleur stuff
const stuffCtrl = require('../controllers/stuff');

// importer le middleware d'authentification
const auth = require('../middleware/auth');

// importer le middleware multer pour la gestion des fichiers
const multer = require('../middleware/multer-config');

// créer un objet (auth et multer requis)
router.post('/', auth, multer, stuffCtrl.createThing);

// récupérer un objet (auth requis)
router.get('/:id', auth, stuffCtrl.getOneThing);

// modifier un objet (auth et multer requis)
router.put('/:id', auth, multer, stuffCtrl.modifyThing);

// supprimer un objet (auth requis)
router.delete('/:id', auth, stuffCtrl.deleteThing);

// récupérer tous les objets (auth requis)
router.get('/', auth, stuffCtrl.getAllThings);

module.exports = router;
