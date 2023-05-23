const http = require('http');
const app = require('./config/server.js');
const db = require('./config/db.js');
const httpServer = http.createServer(app);
const io = require('socket.io')(httpServer);
const socketController = require('./controllers/socketController.js');

//Handle socket connection
io.on('connection', socketController.handleSocketConnection);

const port = process.env.PORT || 3000;
const server = httpServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLER REJECTION!', err);
  server.close(() => {
    process.exit(1);
  });
});
