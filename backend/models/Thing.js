const mongoose = require('mongoose'); // importer mongoose

// schéma pour thing
const thingSchema = mongoose.Schema({
    title: { type: String, required: true, minlength: 1, maxlength: 255 }, // titre requis, min 1 max 255
    description: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1024,
    }, // description requise, min 1 max 1024
    imageUrl: { type: String, required: true }, // url de l'image requise
    userId: { type: String, required: true }, // id utilisateur requis
    price: { type: Number, required: true, min: 0 }, // prix requis, min 0
});

// créer et exporter le modèle thing
module.exports = mongoose.model('Thing', thingSchema);
