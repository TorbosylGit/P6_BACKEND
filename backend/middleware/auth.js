const jwt = require('jsonwebtoken');
require('dotenv').config(); // charger .env

module.exports = (req, res, next) => {
    try {
        // récupérer le token
        const token = req.headers.authorization.split(' ')[1];

        // vérifier le token /clé secrète = variable env
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        // extraire userId
        const userId = decodedToken.userId;

        // ajouter userId à req
        req.auth = { userId: userId };
        next();
    } catch (error) {
        // erreur d'authentification
        res.status(401).json({ error: 'Requête non authentifiée !' });
    }
};
