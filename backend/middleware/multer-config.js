const multer = require('multer'); // gérer les fichiers

// types mime pour les images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

// configurer le stockage des fichiers
const storage = multer.diskStorage({
    // définir le dossier de destination
    destination: (req, file, callback) => {
        callback(null, 'images'); // stocker dans le dossier images
    },
    // générer un nom de fichier unique
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_'); // remplacer espaces par _
        const extension = MIME_TYPES[file.mimetype]; // obtenir l'extension
        callback(null, name + Date.now() + '.' + extension); // nom avec horodatage
    },
});

// filtrer les fichiers pour accepter que les images
const fileFilter = (req, file, callback) => {
    const isValid = MIME_TYPES[file.mimetype]; // vérifier le type mime
    if (isValid) {
        callback(null, true); // accepter le fichier
    } else {
        callback(new Error('type de fichier non autorisé'), false); // refuser le fichier
    }
};

// config multer avec limites de taille et filtre de fichier
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // limite de 2 mo
    fileFilter: fileFilter, // filtrer les fichiers autorisés
});

// exporter le middleware multer configuré
module.exports = upload.single('image');
