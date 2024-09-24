const express = require('express'); // importer express
const router = express.Router(); // créer un routeur
const bookCtrl = require('../controllers/book'); // contrôleur livres
const auth = require('../middleware/auth'); // middleware auth
const multer = require('../middleware/multer-config'); // gestion fichiers
const { optimizeImage } = require('../middleware/multer-config'); // optimisation image

// récupérer tous les livres
router.get('/', bookCtrl.getAllBook);

// créer un livre (auth + upload + optim image)
router.post('/', auth, multer, optimizeImage, bookCtrl.createBook);

// récupérer les 3 meilleurs livres
router.get('/bestrating', bookCtrl.getBestRating);

// récupérer un livre par son id
router.get('/:id', bookCtrl.getOneBook);

// modifier un livre (auth + upload + optim image)
router.put('/:id', auth, multer, optimizeImage, bookCtrl.modifyBook);

// supprimer un livre (auth requis)
router.delete('/:id', auth, bookCtrl.deleteBook);

// ajouter une évaluation (auth requis)
router.post('/:id/rating', auth, bookCtrl.postRating);

module.exports = router; // exporter le routeur
