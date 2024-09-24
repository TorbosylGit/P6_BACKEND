const express = require('express'); // importer express
const router = express.Router(); // créer un routeur
const bookCtrl = require('../controllers/book'); // importer le contrôleur des livres
const auth = require('../middleware/auth'); // middleware d'authentification
const multer = require('../middleware/multer-config'); // middleware de gestion des fichiers
const { optimizeImage } = require('../middleware/multer-config'); // optimiser les images après upload

// récupérer tous les livres
router.get('/', bookCtrl.getAllBook);

// créer un livre (auth + optim image)
router.post('/', auth, optimizeImage, bookCtrl.createBook);

// récupérer les 3 meilleurs livres
router.get('/bestrating', bookCtrl.getBestRating);

// récupérer un livre par son id
router.get('/:id', bookCtrl.getOneBook);

// modifier un livre (auth + optim image)
router.put('/:id', auth, optimizeImage, bookCtrl.modifyBook);

// supprimer un livre (auth requis)
router.delete('/:id', auth, bookCtrl.deleteBook);

// ajouter une évaluation (auth requis)
router.post('/:id/rating', auth, bookCtrl.postRating);

module.exports = router; // exporter le routeur
