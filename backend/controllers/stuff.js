const Thing = require('../models/thing');
const fs = require('fs'); // pour gérer les fichiers

// créer un nouvel objet
exports.createThing = (req, res, next) => {
    const thingObject = JSON.parse(req.body.thing); // extraire l'objet envoyé en form-data

    // suppression des champs sensibles
    delete thingObject._id;
    delete thingObject._userId;

    const thing = new Thing({
        ...thingObject,
        userId: req.auth.userId, // sécuriser l'userId
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`, // générer l'URL de l'image
    });

    thing
        .save()
        .then(() =>
            res.status(201).json({ message: 'Objet enregistré avec succès !' })
        )
        .catch((error) => res.status(400).json({ error }));
};

// récupérer un objet par son id
exports.getOneThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => res.status(200).json(thing))
        .catch((error) => res.status(404).json({ error }));
};

// modifier un objet par son id
exports.modifyThing = (req, res, next) => {
    // vérifier si un fichier est présent, sinon utiliser req.body
    const thingObject = req.file
        ? {
              ...JSON.parse(req.body.thing), // récupérer l'objet depuis req.body
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`, // générer l'URL de l'image
          }
        : { ...req.body }; // sinon, prendre les données du corps

    // supprimer _userId pour éviter la manipulation
    delete thingObject._userId;

    // rechercher l'objet dans la base de données
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            // vérifier que l'utilisateur authentifié est le propriétaire de l'objet
            if (thing.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' }); // non autorisé
            } else {
                // mettre à jour l'objet dans la base de données
                Thing.updateOne(
                    { _id: req.params.id },
                    { ...thingObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: 'Objet modifié!' })
                    ) // succès
                    .catch((error) => res.status(401).json({ error })); // erreur de mise à jour
            }
        })
        .catch((error) => {
            // erreur lors de la recherche de l'objet
            res.status(400).json({ error });
        });
};

// supprimer un objet par son id
exports.deleteThing = (req, res, next) => {
    Thing.findOne({ _id: req.params.id })
        .then((thing) => {
            if (!thing) {
                return res
                    .status(404)
                    .json({ error: new Error('Objet non trouvé !') });
            }

            // vérifier que l'utilisateur est bien le propriétaire de l'objet
            if (thing.userId !== req.auth.userId) {
                return res
                    .status(403)
                    .json({ error: new Error('Requête non autorisée !') });
            }

            // supprimer l'image associée à l'objet
            const filename = thing.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Thing.deleteOne({ _id: req.params.id })
                    .then(() =>
                        res
                            .status(200)
                            .json({ message: 'Objet supprimé avec succès !' })
                    )
                    .catch((error) => res.status(400).json({ error }));
            });
        })
        .catch((error) => res.status(500).json({ error }));
};

// récupérer tous les objets
exports.getAllThings = (req, res, next) => {
    Thing.find()
        .then((things) => res.status(200).json(things))
        .catch((error) => res.status(400).json({ error }));
};
