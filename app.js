var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var expressValidator = require("express-validator");
var indexRouter = require('./routes/index');

var load = require('express-load');
var routes = require('./routes');
var http = require('http');
routes.usuario = require('./routes/users');

var app = express();
app.use(cookieParser());


const serverSocketIO = require("socket.io");
var mongoose = require('mongoose');


const {
  MONGODB_URL = "mongodb://localhost:27017/UserDB",
  SERVER_HOST = "localhost",
  SERVER_PORT = 3000
} = process.env;


// aplicação de análise / x-www-form-urlencoded 
app.use(bodyParser.urlencoded({extended :  false }));

// analisar aplicativo / json 
app.use(bodyParser.json());
app.use(session({'secret': 'seuSegredoAqui'}));

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(expressValidator());

app.use(express.static(path.join(__dirname, 'public')));


load('models').
  then('controllers').
  then('routes').
  into(app);

    
const server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

mongoose.connect(
  MONGODB_URL,
  { useNewUrlParser: true },
  err => {
    if (err) {
      console.log(`[SERVER_ERROR] MongoDB Connection:`, err);
      process.exit(1);
    }

    User.watch().on("change", change => {
      console.log(`[SERVER_CHANGE_STREAM] User:`, change);
      serverIO.emit("changeData", change);
    });

    serverIO.on("connection", function() {
      console.log("[SERVER_SOCKET_IO] New Connection:", client.id);
    });

    server.listen(SERVER_PORT, SERVER_HOST, () => {
      console.log(`[SERVER] Running at ${SERVER_HOST}:${SERVER_PORT}`);
    });
  }
);

module.exports = app;
