const express = require('express'); // importer express
const mongoose = require('mongoose'); // importer mongoose
const path = require('path'); // importer path pour gérer les chemins de fichiers
require('dotenv').config(); // charger les variables d'environnement depuis .env

// importer les routeurs
const bookRoutes = require('./routes/book');
const userRoutes = require('./routes/user');

// créer l'application express
const app = express();

// connexion à mongoDB
mongoose
    .connect(process.env.MONGO_DB)
    .then(() => console.log('connexion réussie à MongoDB !'))
    .catch(() => console.log('connexion échouée à MongoDB !'));

// limiter la taille des requêtes JSON pour éviter les attaques par surcharge
app.use(express.json({ limit: '10kb' }));

// autorisation CORS
app.use((req, res, next) => {
    res.setHeader(
        'Access-Control-Allow-Origin',
        process.env.FRONTEND_URL || 'http://localhost:3000'
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

// routes API
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

// exporter l'application
module.exports = app;
