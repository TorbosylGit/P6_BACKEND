const express = require('express'); // importer express
const mongoose = require('mongoose'); // importer mongoose
const path = require('path'); // importer path pour gérer les chemins de fichiers
require('dotenv').config(); // charger les variables d'environnement depuis .env

// importer les routeurs
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

// créer l'application express
const app = express();

// connecter à mongoDB
mongoose
    .connect(process.env.MONGO_DB)
    .then(() => console.log('connexion réussie à MongoDB !'))
    .catch(() => console.log('connexion échouée à MongoDB !'));

// parser les requêtes json
app.use(express.json());

// autoriser le cors de manière plus sécurisée
app.use((req, res, next) => {
    res.setHeader(
        'Access-Control-Allow-Origin',
        // process.env.FRONTEND_URL || 'http://localhost:3000'
        process.env.FRONTEND_URL || '*'

    ); // restreindre à l'origine du frontend
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    ); // headers autorisés
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    ); // méthodes autorisées
    next();
});

// servir les fichiers statiques du dossier images
app.use('/images', express.static(path.join(__dirname, 'images')));

// utiliser les routes pour /api/books
app.use('/api/books', bookRoutes);

// utiliser les routes pour /api/auth
app.use('/api/auth', userRoutes);

// exporter l'application
module.exports = app;
