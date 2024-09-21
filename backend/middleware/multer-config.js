const multer = require('multer');

// types mime pour les images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

// configuration du stockage
const storage = multer.diskStorage({
    // dossier de destination
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    // nom du fichier
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // remplacer espaces par _
        const extension = MIME_TYPES[file.mimetype]; // extension basée sur le type mime
        callback(null, name + Date.now() + '.' + extension); // ajouter horodatage
    },
});

// exporter le middleware multer
module.exports = multer({ storage: storage }).single('image');
