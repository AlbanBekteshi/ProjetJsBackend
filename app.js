/*// Socket.io
const EXPRESS = require('express');
let myExpressServerApplication = EXPRESS();
let myHttpExpressServer = require('http').createServer(myExpressServerApplication);

const io = require("socket.io")(myHttpExpressServer, {
  cors: {
    origin: "http://localhost", // Client here is localhost:80
    methods: ["GET", "POST"]
  }
});

io.on('connection', socket => {
  console.log('New Socket Connection');
  socket.emit("broadcast", "New Socket Client : Welcome !");
});

myHttpExpressServer.listen(3000, ()  => {
  console.log('Socket server listening on *:3000');
});
*/
const WebSocket = require('ws');

const webSocketServer = new WebSocket.Server({ port: 8080 });

webSocketServer.on('connection', webSocket => {
  webSocket.on('message', message => {
    console.log('Received:', message);
    broadcast(message);
  });
});

function broadcast(data) {
  webSocketServer.clients.forEach(user => {
    if (user.readyState === WebSocket.OPEN) {
      user.send(data);
    }
  });
}
//---------------------------------------------------
var createError = require("http-errors");
var express = require("express");
var path = require("path");
//var cookieParser = require("cookie-parser");
var logger = require("morgan");

var usersRouter = require("./routes/users");
var itemsRouter = require("./routes/items");
var gamesRouter = require("./routes/games");
var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/items", itemsRouter);
app.use("/api/users", usersRouter);
app.use("/api/games", gamesRouter);



// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {  
  // render the error page
  res.status(err.status || 500);
  res.send(err.message);
});


module.exports = app;
