// import express
const express = require('express');

// import path pour gérer les chemins de fichiers
const path = require('path');

// import mongoose
const mongoose = require('mongoose');

// import routeur book
const bookRoute = require('./routes/book');

// import routeur user
const userRoutes = require('./routes/user');

// création de l'app
const app = express();

// charger les variables d'environnement
require('dotenv').config();

// connexion à mongoDB
mongoose
    .connect(process.env.MONGO_DB)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

// parser json
app.use(express.json());

// autorisations CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

// servir les fichiers statiques du dossier 'images'
app.use('/images', express.static(path.join(__dirname, 'images')));

// utilisation des routes pour /api/stuff
app.use('/api/books', bookRoute);

// utilisation des routes pour /api/auth
app.use('/api/auth', userRoutes);

// export app
module.exports = app;
