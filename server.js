/*
*Cette page à étée réalisée en s'inspirant des tutoriels suivant:
*Vidéo youtube de David Tang nommé Intro to Web Sockets in Node.js lien: https://www.youtube.com/watch?v=dQTzL3enFng&feature=youtu.be&ab_channel=DavidTang
*Vidéo youtube de Fireship nommé WebSockets in 100 Seconds & Beyond with Socket.io lien: https://www.youtube.com/watch?v=1BfCnjr_Vjg&ab_channel=Fireship
*/
/*
*Initialisation du webSocketServer
*/
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