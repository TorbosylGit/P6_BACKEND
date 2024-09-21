const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// inscription (signup)
exports.signup = async (req, res, next) => {
    try {
        // hacher le mot de passe avec bcrypt
        const hash = await bcrypt.hash(req.body.password, 10);

        // création du nouvel utilisateur
        const user = new User({
            email: req.body.email,
            password: hash, // stocker le mot de passe haché
        });

        // sauvegarde de l'utilisateur dans la base de données
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès !' });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// connexion (login)
exports.login = async (req, res, next) => {
    try {
        // recherche de l'utilisateur avec l'email fourni
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }

        // comparaison du mot de passe
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Utilisateur non trouvé !' });
        }

        // génération du token JWT avec une clé secrète depuis les variables d'environnement
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET, // utilisation d'une clé secrète stockée
            { expiresIn: '24h' }
        );

        // réponse avec le token et l'id utilisateur
        res.status(200).json({
            userId: user._id,
            token: token,
        });
    } catch (error) {
        res.status(500).json({
            error: 'Une erreur est survenue lors de la connexion.',
        });
    }
};
