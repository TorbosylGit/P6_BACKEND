const jwt = require('jsonwebtoken'); // gérer les tokens jwt
require('dotenv').config(); // charger .env

module.exports = (req, res, next) => {
    try {
        // extraire le token de l'en-tête authorization
        const token = req.headers.authorization.split(' ')[1];
        // vérifier le token avec la clé secrète
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        // extraire l'userId du token décodé
        const userId = decodedToken.userId;
        // ajouter userId à req pour l'utiliser
        req.auth = { userId: userId };
        // passer au middleware suivant
        next();
    } catch (error) {
        // renvoyer une erreur si le token est invalide
        res.status(401).json({ error: 'requête non authentifiée !' });
    }
};
