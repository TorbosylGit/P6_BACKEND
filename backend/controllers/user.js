const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator'); // valider les entrées utilisateur
const User = require('../models/User');

// inscription (signup)
exports.signup = async (req, res, next) => {
    try {
        // valider l'email avec validator
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({ error: 'Email invalide' });
        }

        // valider le mot de passe (min 6 caractères)
        if (!validator.isLength(req.body.password, { min: 6 })) {
            return res
                .status(400)
                .json({ error: 'Mot de passe trop court (min 6 caractères)' });
        }

        // hacher le mot de passe avec bcrypt
        const hash = await bcrypt.hash(req.body.password, 10);

        // créer un nouvel utilisateur
        const user = new User({
            email: req.body.email,
            password: hash,
        });

        // sauvegarder l'utilisateur dans la base de données
        await user.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès !' });
    } catch (error) {
        console.error(error); // logger l'erreur
        res.status(500).json({
            message: "Erreur serveur lors de la création de l'utilisateur",
        });
    }
};

// connexion (login)
exports.login = async (req, res, next) => {
    try {
        // valider l'email avec validator
        if (!validator.isEmail(req.body.email)) {
            return res.status(400).json({ error: 'Email invalide' });
        }

        // recherche de l'utilisateur par email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: 'Utilisateur non trouvé' });
        }

        // comparer le mot de passe avec bcrypt
        const valid = await bcrypt.compare(req.body.password, user.password);
        if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // générer un token JWT avec expiration (24h)
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET, // utiliser une clé secrète stockée dans .env
            { expiresIn: '24h' }
        );

        // renvoyer l'utilisateur et le token
        res.status(200).json({
            userId: user._id,
            token: token,
        });
    } catch (error) {
        console.error(error); // logger l'erreur
        res.status(500).json({
            message: 'Erreur serveur lors de la connexion',
        });
    }
};
