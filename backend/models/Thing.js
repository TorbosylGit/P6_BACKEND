// import mongoose
const mongoose = require('mongoose');

// définir le schema de thing
const thingSchema = mongoose.Schema({
    title: { type: String, required: true }, // titre requis
    description: { type: String, required: true }, // description requise
    imageUrl: { type: String, required: true }, // url de l'image requise
    userId: { type: String, required: true }, // id de l'utilisateur requis
    price: { type: Number, required: true }, // prix requis
});

// exporter le modèle
module.exports = mongoose.model('Thing', thingSchema);
