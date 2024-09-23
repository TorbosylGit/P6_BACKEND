const Thing = require('../models/Thing');
const fs = require('fs');
const validator = require('validator'); // valider les entrées utilisateur

// créer un nouvel objet
exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing); // extraire les données

    // valider et sanitiser les entrées
    if (!validator.isLength(thingObject.title, { min: 1 })) {
        return res.status(400).json({ error: 'Titre requis' });
    }
    if (!validator.isLength(thingObject.description, { min: 1 })) {
        return res.status(400).json({ error: 'Description requise' });
    }
    if (!validator.isFloat(thingObject.price.toString())) {
        return res.status(400).json({ error: 'Prix invalide' });
    }

    // sanitiser les autres champs pour éviter XSS
    thingObject.title = sanitize(thingObject.title);
    thingObject.description = sanitize(thingObject.description);

    // supprimer les champs non autorisés
    delete thingObject._id;
    delete thingObject._userId;

    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId, // sécuriser userId
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`,
    });

    thing
        .save()
        .then(() =>
            res.status(201).json({ message: 'Objet enregistré avec succès !' })
        )
        .catch((error) => {
            console.error(error); // logger l'erreur
            res.status(500).json({
                message: "Erreur serveur lors de l'enregistrement",
            });
        });
};

// récupérer un objet par son id
exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => res.status(200).json(thing))
        .catch((error) => {
            console.error(error); // logger l'erreur
            res.status(404).json({ message: 'Objet non trouvé' });
        });
};

// modifier un objet par son id
exports.modifyThing = (req, res, next) => {
    const thingObject = req.file
        ? {
              ...JSON.parse(req.body.thing), // si fichier, extraire l'objet
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };

    // valider et sanitiser les entrées
    if (
        thingObject.title &&
        !validator.isLength(thingObject.title, { min: 1 })
    ) {
        return res.status(400).json({ error: 'Titre requis' });
    }
    if (
        thingObject.description &&
        !validator.isLength(thingObject.description, { min: 1 })
    ) {
        return res.status(400).json({ error: 'Description requise' });
    }
    if (thingObject.price && !validator.isFloat(thingObject.price.toString())) {
        return res.status(400).json({ error: 'Prix invalide' });
    }

    // sanitiser les champs pour éviter XSS
    if (thingObject.title) thingObject.title = sanitize(thingObject.title);
    if (thingObject.description)
        thingObject.description = sanitize(thingObject.description);

    delete thingObject._userId; // éviter la modification du userId

    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (thing.userId != req.auth.userId) {
                return res.status(403).json({ message: 'Non autorisé' });
            }

            Thing.updateOne(
                { _id: req.params.id },
                { ...thingObject, _id: req.params.id }
            )
                .then(() =>
                    res
                        .status(200)
                        .json({ message: 'Objet modifié avec succès !' })
                )
                .catch((error) => {
                    console.error(error); // logger l'erreur
                    res.status(500).json({
                        message: 'Erreur serveur lors de la modification',
                    });
                });
        })
        .catch((error) => {
            console.error(error); // logger l'erreur
            res.status(404).json({ message: 'Objet non trouvé' });
        });
};

// supprimer un objet par son id
exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (!thing) {
                return res.status(404).json({ message: 'Objet non trouvé' });
            }
            if (thing.userId !== req.auth.userId) {
                return res.status(403).json({ message: 'Non autorisé' });
            }

            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({ _id: req.params.id })
                    .then(() =>
                        res
                            .status(200)
                            .json({ message: 'Objet supprimé avec succès !' })
                    )
                    .catch((error) => {
                        console.error(error); // logger l'erreur
                        res.status(500).json({
                            message: 'Erreur serveur lors de la suppression',
                        });
                    });
            });
        })
        .catch((error) => {
            console.error(error); // logger l'erreur
            res.status(500).json({ message: 'Erreur serveur' });
        });
};

// récupérer tous les objets
exports.getAllThings = (req, res, next) => {
    Thing.find()
        .then((things) => res.status(200).json(things))
        .catch((error) => {
            console.error(error); // logger l'erreur
            res.status(500).json({ message: 'Erreur serveur' });
        });
};
