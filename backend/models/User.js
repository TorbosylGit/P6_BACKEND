const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// schéma utilisateur
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true }, // champ email unique et requis
  password: { type: String, required: true } // champ mot de passe requis
});

// vérifier mail unique avec le plugin uniqueValidator
userSchema.plugin(uniqueValidator);

// exporter le modèle utilisateur
module.exports = mongoose.model('User', userSchema);

// céer les routes pour l'api 
// création/lecture des users