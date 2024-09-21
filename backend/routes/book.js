const express = require('express');
const router = express.Router();

// importer le contrôleur stuff
const stuffCtrl = require('../controllers/book');

// importer le middleware d'authentification
const auth = require('../middleware/auth');

// importer le middleware multer pour la gestion des fichiers
const multer = require('../middleware/multer-config');

router.get('/', stuffCtrl.getAllBook);
router.get('/:id', stuffCtrl.getOneBook);
router.get('/bestrating', stuffCtrl.getBestRating);
router.post('/', auth, multer, stuffCtrl.createBook);
router.put('/:id', auth, multer, stuffCtrl.modifyBook);
router.delete('/:id', auth, stuffCtrl.deleteBook);
router.post('/:id/rating', auth, multer, stuffCtrl.postRating);


module.exports = router;
