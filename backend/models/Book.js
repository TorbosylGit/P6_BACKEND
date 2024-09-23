const mongoose = require('mongoose'); // importer mongoose

// schéma de notation
const ratingSchema = new mongoose.Schema({
    _id: false, // désactiver l'_id pour les notations
    userId: { type: String, required: true }, // id utilisateur requis
    grade: { type: Number, required: true, min: 1, max: 5 }, // note entre 1 et 5
});

// schéma du livre
const bookSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // id de l'utilisateur requis
    title: { type: String, required: true, minlength: 1, maxlength: 255 }, // titre requis, min 1 max 255
    author: { type: String, required: true, minlength: 1, maxlength: 255 }, // auteur requis, min 1 max 255
    imageUrl: { type: String, required: true }, // url de l'image requise
    year: { type: Number, required: true, min: 1000, max: 9999 }, // année valide requise
    genre: { type: String, required: true, minlength: 1, maxlength: 100 }, // genre requis, min 1 max 100
    ratings: { type: [ratingSchema], default: [] }, // tableau de notations
    averageRating: { type: Number, default: 0 }, // note moyenne par défaut 0
});

// créer et exporter le modèle book
const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
