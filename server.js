var express       = require('express')
var compression   = require('compression')
var middleware    = require('./middleware/auth')
var cookieParser  = require('cookie-parser')
var bodyParser    = require('body-parser'); //ler campos no body da pagina
var config        = require('./config'); // get our config file

var path          = require('path');
var fs            = require('fs')
var https         = require('https');

var port = process.env.PORT || 8080;
var app = express();

// Redirect from http port 3000 to https 8080
if (config.useHttps){

  var http          = require('http');
  var app2 = express();
  http.createServer(app2).listen(3000);
  app2.use(function(req, res, next) {
    if(!req.secure) {
      //redireciona no mesmo porto
      //return res.redirect('https://' + req.headers.host + req.url);
      //em cima linha a usar em produção
      return res.redirect('https://' + 'localhost:8080' + req.url);
    }
    next();
  });

}

app.use(compression());
app.disable('x-powered-by');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

// pasta publica
app.use('/app', express.static(path.join(__dirname, 'dist')));

app.get('/', function(req, res){
  res.sendFile(__dirname + '/dist/index.html');
});

app.get('/user', middleware.autenticar, function(req, res){
  res.sendFile(__dirname + '/pages/user.html');
});

app.get('/login', function(req, res){
  res.sendFile(__dirname + '/dist/login.html');
});

app.post('/login', function(req, res){
  middleware.login(req, res);
});

app.get('/logout', function(req, res){
  res.clearCookie("token");
  res.cookie('userName', "anonimo" , { maxAge: config.tokenDuration, sameSite: 'Strict'});
  res.redirect('/');
});

// registar user no sistema
app.get('/registar', function(req, res){ ///registar?#erro1
  res.sendFile(__dirname + '/dist/registar.html');
});

app.post('/regist', function(req, res) {
  middleware.registar(req, res);
});

app.get('*', function(req, res){
  res.sendFile(__dirname + '/dist/erro.html');
});
if (config.useHttps) {

  // com https self signed certificate
  https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'certificate', 'server.key')),
    //key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync(path.join(__dirname, 'certificate', 'server.crt')),
    //cert: fs.readFileSync('cert.pem')
    passphrase: 'lamePass' // certificate passphrase
  }, app).listen(port);
  console.log('server at https://localhost:' + port + ' with self signed certificate.');

} else {

  app.listen(3000)
  console.log('server at http://localhost:3000.');

}
