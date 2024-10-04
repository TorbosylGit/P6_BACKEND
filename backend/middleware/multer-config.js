// const multer = require('multer'); // gérer les fichiers
// const sharp = require('sharp'); // optimiser les images
// const path = require('path'); // gérer les chemins
// const fs = require('fs'); // gérer les fichiers

// // types mime acceptés pour les images
// const MIME_TYPES = {
//     'image/jpg': 'jpg',
//     'image/jpeg': 'jpg',
//     'image/png': 'png',
// };

// // configurer multer pour stocker les fichiers en mémoire avant traitement
// const storage = multer.memoryStorage(); // stockage temporaire en mémoire

// // filtre pour accepter uniquement les fichiers images
// const fileFilter = (req, file, callback) => {
//     const isValid = MIME_TYPES[file.mimetype]; // vérifier si le type de fichier est valide
//     if (isValid) {
//         callback(null, true); // accepter l'image
//     } else {
//         callback(new Error('Type de fichier non autorisé'), false); // refuser les autres types
//     }
// };

// // configurer multer avec une limite de taille (2 Mo) et un filtre de fichier
// const multerUpload = multer({
//     storage: storage,
//     limits: { fileSize: 2 * 1024 * 1024 }, // limiter la taille à 2 Mo
//     fileFilter: fileFilter, // appliquer le filtre pour les types d'images
// });

// // middleware pour optimiser l'image avec sharp après upload
// const optimizeImage = (req, res, next) => {
//     if (!req.file) {
//         return next(); // passer à l'étape suivante s'il n'y a pas de fichier
//     }

//     const extension = MIME_TYPES[req.file.mimetype]; // obtenir l'extension du fichier
//     const filename = `${req.file.originalname
//         .split(' ')
//         .join('_')}_${Date.now()}.${extension}`; // générer un nom unique
//     const outputPath = path.join(__dirname, '../images/', filename); // chemin de sortie du fichier optimisé

//     // traitement de l'image avec sharp
//     sharp(req.file.buffer)
//         .resize({ width: 400 }) // redimensionner à 400px (taille container en mode desktop)
//         .toFormat('webp') // convertir en WebP
//         .jpeg({ quality: 80 }) // compresser l'image à 80% de qualité
//         .toFile(outputPath, (err) => {
//             if (err) {
//                 return next(err); // gestion des erreurs
//             }

//             // mise à jour des informations du fichier optimisé dans req.file
//             req.file.filename = filename;
//             req.file.path = outputPath;
//             next(); // passer à l'étape suivante
//         });
// };

// // exporter multer pour gérer l'upload et la fonction d'optimisation
// module.exports = multerUpload.single('image'); // gestion de l'upload d'une seule image
// module.exports.optimizeImage = optimizeImage; // exporter le middleware d'optimisation

//---------------------------------------------------

const multer = require('multer'); // gérer les fichiers
const sharp = require('sharp'); // optimiser les images
const path = require('path'); // gérer les chemins
const fs = require('fs'); // gérer les fichiers

// types mime acceptés pour les images
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
};

// configurer multer pour stocker les fichiers en mémoire avant traitement
const storage = multer.memoryStorage(); // stockage temporaire en mémoire

// filtre pour accepter uniquement les fichiers images
const fileFilter = (req, file, callback) => {
    const isValid = MIME_TYPES[file.mimetype]; // vérifier si le type de fichier est valide
    if (isValid) {
        callback(null, true); // accepter l'image
    } else {
        callback(new Error('Type de fichier non autorisé'), false); // refuser les autres types
    }
};

// configurer multer avec une limite de taille (2 Mo) et un filtre de fichier
const multerUpload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // limiter la taille à 2 Mo
    fileFilter: fileFilter, // appliquer le filtre pour les types d'images
});

// middleware pour optimiser l'image avec sharp après upload
const optimizeImage = (req, res, next) => {
    if (!req.file) {
        return next(); // passer à l'étape suivante s'il n'y a pas de fichier
    }

    // définir le nom et le chemin de sortie en webp
    const filename = `${req.file.originalname.split(' ').join('_')}_${Date.now()}.webp`;
    const outputPath = path.join(__dirname, '../images/', filename);

    // traitement de l'image avec sharp
    sharp(req.file.buffer)
        .resize({ width: 400 }) // redimensionner à 400px (taille optimisée pour affichage desktop)
        .toFormat('webp') // convertir en WebP
        .webp({ quality: 80 }) // compresser l'image à 80% de qualité
        .toFile(outputPath, (err) => {
            if (err) {
                return next(err); // gestion des erreurs
            }

            // mise à jour des informations du fichier optimisé dans req.file
            req.file.filename = filename;
            req.file.path = outputPath;
            next(); // passer à l'étape suivante
        });
};

// exporter multer pour gérer l'upload et la fonction d'optimisation
module.exports = multerUpload.single('image'); // gestion de l'upload d'une seule image
module.exports.optimizeImage = optimizeImage; // exporter le middleware d'optimisation
