const http = require('http'); // importer http
const app = require('./app'); // importer l'application express

// normaliser le port en un nombre ou une chaîne
const normalizePort = (val) => {
    const port = parseInt(val, 10); // convertir la valeur en entier
    if (isNaN(port)) {
        // si ce n'est pas un nombre
        return val; // retourner la valeur originale
    }
    if (port >= 0) {
        // si le port est valide
        return port; // retourner le port
    }
    return false; // sinon, retourner false
};

// définir le port d'écoute
const port = normalizePort(process.env.PORT || '4000'); // port par défaut 4000
app.set('port', port); // définir le port pour l'application

// gestion des erreurs
const errorHandler = (error) => {
    if (error.syscall !== 'listen') {
        throw error; // si l'erreur n'est pas liée à l'écoute, la relancer
    }
    const address = server.address(); // obtenir l'adresse du serveur
    const bind =
        typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; // définir le bind

    // gérer les erreurs spécifiques
    switch (error.code) {
        case 'EACCES': // privilèges insuffisants
            console.error(bind + ' requires elevated privileges.');
            process.exit(1); // quitter l'application
            break;
        case 'EADDRINUSE': // port déjà utilisé
            console.error(bind + ' is already in use.');
            process.exit(1); // quitter l'application
            break;
        default:
            throw error; // pour les autres erreurs, les relancer
    }
};

// créer le serveur HTTP
const server = http.createServer(app);

// écouter les événements du serveur
server.on('error', errorHandler); // gérer les erreurs
server.on('listening', () => {
    const address = server.address(); // obtenir l'adresse du serveur
    const bind =
        typeof address === 'string' ? 'pipe ' + address : 'port ' + port; // définir le bind
    console.log('Listening on ' + bind); // afficher le port d'écoute
});

// lancer le serveur
server.listen(port);
