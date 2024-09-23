const mongoose = require('mongoose'); // importer mongoose
const uniqueValidator = require('mongoose-unique-validator'); // validation email unique
const validator = require('validator'); // valider les emails

// schéma utilisateur
const userSchema = mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true, 
    validate: [validator.isEmail, 'Adresse email invalide'] // valider le format email
  }, 
  password: { 
    type: String, 
    required: true, 
    minlength: 6 // mot de passe min 6 caractères
  }
});

// appliquer le validateur pour les champs uniques (email)
userSchema.plugin(uniqueValidator);

// exporter le modèle user
module.exports = mongoose.model('User', userSchema);
