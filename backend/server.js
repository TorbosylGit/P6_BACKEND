// importe le module http
const http = require('http');
// importe l'application
const app = require('./app');

// normalise le port en un entier ou une chaîne
const normalizePort = val => {
  const port = parseInt(val, 10);

  // vérifie si c'est un nombre
  if (isNaN(port)) {
    return val;
  }
  // vérifie si le port est valide
  if (port >= 0) {
    return port;
  }
  return false;
};

// définit le port, par défaut 3000
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// gère les erreurs de serveur
const errorHandler = error => {
  // si l'erreur n'est pas liée à l'écoute
  if (error.syscall !== 'listen') {
    throw error;
  }
  // obtient l'adresse du serveur
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  
  // gestion des erreurs spécifiques
  switch (error.code) {
    case 'EACCES':
      // privilèges insuffisants
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      // port déjà utilisé
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      // autres erreurs
      throw error;
  }
};

// création du serveur http
const server = http.createServer(app);

// gestionnaire d'erreurs
server.on('error', errorHandler);

// le server fonctionne et écoute
server.on('listening', () => {
  // obtient l'adresse du serveur
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// lancer le server qui écoute
server.listen(port);
