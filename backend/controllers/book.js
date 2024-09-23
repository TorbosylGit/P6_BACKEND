const Book = require('../models/Book');
const fs = require('fs');
const validator = require('validator'); // pour valider les données

// récupérer tous les livres
exports.getAllBook = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => {
            console.error(error); // logger l'erreur
            res.status(500).json({ message: 'Erreur serveur' });
        });
};

// récupérer un livre par son id
exports.getOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => {
            console.error(error); // logger l'erreur
            res.status(404).json({ message: 'Livre non trouvé' });
        });
};

// récupérer les 3 meilleurs livres par note
exports.getBestRating = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => res.status(200).json(books))
        .catch((error) => {
            console.error(error); // logger l'erreur
            res.status(500).json({ message: 'Erreur serveur' });
        });
};

// créer un livre
exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book);

    // vérifier si le fichier est présent
    if (!req.file || !req.file.filename) {
        return res.status(400).json({ error: 'Fichier image manquant' });
    }

    // valider et sanitiser les entrées
    if (!validator.isLength(bookObject.title, { min: 1 })) {
        return res.status(400).json({ error: 'Titre requis' });
    }
    if (!validator.isLength(bookObject.author, { min: 1 })) {
        return res.status(400).json({ error: 'Auteur requis' });
    }
    if (!validator.isLength(bookObject.genre, { min: 1, max: 100 })) {
        return res
            .status(400)
            .json({
                error: 'Genre invalide ou trop long (100 caractères max)',
            });
    }
    if (
        !validator.isInt(bookObject.year.toString(), { min: 1000, max: 9999 })
    ) {
        return res.status(400).json({ error: 'Année invalide' });
    }

    // suppression des champs non autorisés
    delete bookObject._id;
    delete bookObject._userId;

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`,
    });

    book.save()
        .then(() =>
            res.status(201).json({ message: 'Livre enregistré avec succès !' })
        )
        .catch((error) => {
            console.error(error); // logger l'erreur
            res.status(500).json({
                message: "Erreur lors de l'enregistrement du livre",
            });
        });
};

// modifier un livre par son id
exports.modifyBook = (req, res, next) => {
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body };

    // valider et sanitiser les entrées
    if (bookObject.title && !validator.isLength(bookObject.title, { min: 1 })) {
        return res.status(400).json({ error: 'Titre requis' });
    }
    if (
        bookObject.author &&
        !validator.isLength(bookObject.author, { min: 1 })
    ) {
        return res.status(400).json({ error: 'Auteur requis' });
    }
    if (
        bookObject.genre &&
        !validator.isLength(bookObject.genre, { min: 1, max: 100 })
    ) {
        return res
            .status(400)
            .json({
                error: 'Genre invalide ou trop long (100 caractères max)',
            });
    }
    if (
        bookObject.year &&
        !validator.isInt(bookObject.year.toString(), { min: 1000, max: 9999 })
    ) {
        return res.status(400).json({ error: 'Année invalide' });
    }

    delete bookObject._userId; // éviter la modification de l'userId

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                return res.status(403).json({ message: 'Non autorisé' });
            }

            Book.updateOne(
                { _id: req.params.id },
                { ...bookObject, _id: req.params.id }
            )
                .then(() =>
                    res
                        .status(200)
                        .json({ message: 'Livre modifié avec succès !' })
                )
                .catch((error) => {
                    console.error(error); // logger l'erreur
                    res.status(500).json({
                        message: 'Erreur lors de la modification',
                    });
                });
        })
        .catch((error) => {
            console.error(error); // logger l'erreur
            res.status(404).json({ message: 'Livre non trouvé' });
        });
};

// supprimer un livre par son id
exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                return res.status(404).json({ message: 'Livre non trouvé' });
            }
            if (book.userId !== req.auth.userId) {
                return res.status(403).json({ message: 'Non autorisé' });
            }

            const filename = book.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Book.deleteOne({ _id: req.params.id })
                    .then(() =>
                        res
                            .status(200)
                            .json({ message: 'Livre supprimé avec succès !' })
                    )
                    .catch((error) => {
                        console.error(error); // logger l'erreur
                        res.status(500).json({
                            message: 'Erreur lors de la suppression',
                        });
                    });
            });
        })
        .catch((error) => {
            console.error(error); // logger l'erreur
            res.status(500).json({ message: 'Erreur serveur' });
        });
};

// ajouter une évaluation à un livre
exports.postRating = (req, res, next) => {
    const { userId, rating } = req.body;

    // vérifier la note entre 1 et 5
    if (!validator.isInt(rating.toString(), { min: 1, max: 5 })) {
        return res.status(400).json({ error: 'Note entre 1 et 5 requise' });
    }

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.ratings.find((r) => r.userId === userId)) {
                return res
                    .status(400)
                    .json({ error: 'Vous avez déjà noté ce livre' });
            }

            const newRating = { userId, grade: rating };
            book.ratings.push(newRating);

            // recalculer la moyenne des notes
            book.averageRating =
                book.ratings.reduce((sum, r) => sum + r.grade, 0) /
                book.ratings.length;

            book.save()
                .then(() => res.status(200).json(book))
                .catch((error) => {
                    console.error(error); // logger l'erreur
                    res.status(500).json({
                        message: "Erreur lors de l'enregistrement de la note",
                    });
                });
        })
        .catch((error) => {
            console.error(error); // logger l'erreur
            res.status(404).json({ message: 'Livre non trouvé' });
        });
};
