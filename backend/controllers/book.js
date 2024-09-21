const Book = require('../models/Book');
const fs = require('fs'); // pour gérer les fichiers

// récupérer tous les objets
exports.getAllBook = (req, res, next) => {
    Book.find()
        .then((things) => res.status(200).json(things))
        .catch((error) => res.status(400).json({ error }));
};

// récupérer un objet par son id
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }));
};

// renvoie les 3 livres avec la meilleure note moyenne
exports.getBestRating = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }));
};

// créer un nouvel objet
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book); // extraire l'objet envoyé en form-data

    // suppression des champs sensibles
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId, // sécuriser l'userId
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`, // générer l'URL de l'image
    });

    book.save()
        .then(() =>
            res.status(201).json({ message: 'Objet enregistré avec succès !' })
        )
        .catch((error) => res.status(400).json({ error }));
};

// modifier un objet par son id
exports.modifyBook = (req, res, next) => {
    // vérifier si un fichier est présent, sinon utiliser req.body
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book), // récupérer l'objet depuis req.body
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`, // générer l'URL de l'image
          }
        : { ...req.body }; // sinon, prendre les données du corps

    // supprimer _userId pour éviter la manipulation
    delete bookObject._userId;

    // rechercher l'objet dans la base de données
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // vérifier que l'utilisateur authentifié est le propriétaire de l'objet
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' }); // non autorisé
            } else {
                // mettre à jour l'objet dans la base de données
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
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
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res
                    .status(404)
                    .json({ error: new Error('Objet non trouvé !') });
            }

            // vérifier que l'utilisateur est bien le propriétaire de l'objet
            if (book.userId !== req.auth.userId) {
                return res
                    .status(403)
                    .json({ error: new Error('Requête non autorisée !') });
            }

            // supprimer l'image associée à l'objet
            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({ _id: req.params.id })
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

// enregistrer une évaluation
exports.postRating = (req, res, next) => {
    // extraire userId et rating
    const { userId, rating } = req.body;

    // vérifier que la note est entre 0 et 5
    if (rating < 0 || rating > 5) {
        return res
            .status(400)
            .json({ error: 'la note doit être entre 0 et 5.' });
    }

    // trouver le livre avec l'id
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            // vérifier si l'utilisateur a déjà noté
            const existingRating = book.ratings.find(
                (r) => r.userId === userId
            );
            if (existingRating) {
                return res
                    .status(400)
                    .json({ error: 'vous avez déjà noté ce livre.' });
            }

            // ajouter la nouvelle note
            const newRating = { userId, grade: rating };
            book.ratings.push(newRating);

            // recalculer la moyenne
            const totalRatings = book.ratings.length;
            const sumRatings = book.ratings.reduce(
                (sum, r) => sum + r.grade,
                0
            );
            book.averageRating = sumRatings / totalRatings;

            // sauvegarder le livre mis à jour
            book.save()
                .then(() => res.status(200).json(book)) // renvoyer le livre mis à jour
                .catch((error) =>
                    res
                        .status(400)
                        .json({ error: 'erreur lors de la sauvegarde.' })
                );
        })
        .catch((error) => res.status(404).json({ error: 'livre non trouvé.' }));
};
