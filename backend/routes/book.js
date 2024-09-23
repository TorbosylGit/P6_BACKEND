const express = require('express');
const router = express.Router();

// importer le contrôleur pour les livres
const bookCtrl = require('../controllers/book');

// middleware pour l'authentification des utilisateurs
const auth = require('../middleware/auth');

// multer pour gérer l'upload des fichiers
const multer = require('../middleware/multer-config');

// fonction pour optimiser les images après upload
const { optimizeImage } = require('../middleware/multer-config');

// récupérer tous les livres
router.get('/', bookCtrl.getAllBook);

// récupérer un livre par son id
router.get('/:id', bookCtrl.getOneBook);

// récupérer les 3 livres les mieux notés
router.get('/bestrating', bookCtrl.getBestRating);

// créer un livre avec authentification, upload et optimisation d'image
router.post('/', auth, multer, optimizeImage, bookCtrl.createBook);

// modifier un livre avec authentification, upload et optimisation d'image
router.put('/:id', auth, multer, optimizeImage, bookCtrl.modifyBook);

// supprimer un livre avec authentification
router.delete('/:id', auth, bookCtrl.deleteBook);

// ajouter une évaluation à un livre
router.post('/:id/rating', auth, bookCtrl.postRating);

module.exports = router;
