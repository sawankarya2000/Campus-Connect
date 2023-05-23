exports.handleSocketConnection = (socket) => {
  console.log('A user connected');

  // Handle incoming messages from the client
  socket.on('message', (message) => {
    console.log('Received message:', message);
    // Process the message and broadcast it to other connected clients
    socket.broadcast.emit('message', message);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('A user disconnected');
    // Perform any necessary cleanup or logging tasks
  });
};
