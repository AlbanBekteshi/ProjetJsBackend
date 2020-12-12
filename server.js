const {Server, OPEN} = require("ws");
const webSocketServer = new Server({ port: 8080 });

webSocketServer.on('connection', webSocket => {
  webSocket.on('message', message => {
    broadcast(message);
  });
});

function broadcast(data) {
  webSocketServer.clients.forEach(client => {
    if (client.readyState === OPEN) {
      client.send(data);
    }
  });
}