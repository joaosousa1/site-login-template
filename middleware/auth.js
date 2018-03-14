var mongoose      = require('mongoose'); //database
var bcrypt        = require('bcryptjs'); //cria hash para password
var jwt           = require('jsonwebtoken'); // used to create, sign, and verify tokens
var User          = require('./../models/user'); // get our mongoose model
var config        = require('./../config'); // get our config file

mongoose.connect(config.database); // connect to database

var login = function (req, res) {

  // find the user
  User.findOne({
    name: req.body.name
  }, function(err, user) {
    if (err) throw err;

    if (!user) {
      res.redirect('/login#erro');
      //res.json({ success: false, message: 'Authentication failed. User not found.' });
    } else if (user) {

      // check if password matches bcrypt
      if (!bcrypt.compareSync(req.body.password, user.password)) {
        res.redirect('/login#erro');
        //res.json({ success: false, message: 'Authentication failed. Wrong password.' });
      } else {

        // if user is found and password is right, create a token
        var payload = {
          'name': user.name
        };

        var token = jwt.sign( payload, config.secret, { expiresIn: config.tokenDuration / 1000 });

        if (config.useHttps) {

          // guardar cookie e direcionar para a pagina segura
          res.cookie('token',token, { maxAge: config.tokenDuration, httpOnly: true, sameSite: 'Strict', secure: true});

        } else {
          res.cookie('token',token, { maxAge: config.tokenDuration, httpOnly: true, sameSite: 'Strict'});
        }
        
        res.cookie('userName', user.name , { maxAge: config.tokenDuration, sameSite: 'Strict'});
        res.redirect('/user');
      }
    }
  });

}
module.exports.login = login

var autenticar = function (req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.cookies.token;

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        res.cookie('userName','anonimo', { maxAge: config.tokenDuration, sameSite: 'Strict'});
      } else {
        // find the user permission
        // não e possivel revogar tokens mas pode se tirar permição ao user que esta na tokem :P no mongodb
        // para revogar todas as tokens mudar a key secret in config.js
        User.findOne({
          name: decoded.name
        }, function(err, user) {
          if (user.permission == true){
            //com tokem usa json da api :)
            next();
          } else {
            res.cookie('userName','anonimo', { maxAge: config.tokenDuration, sameSite: 'Strict'});
          }
        })
      }
    });

  } else {

    //sem tokem usa o json da pasta public
    res.cookie('userName', 'anonimo' , { maxAge: config.tokenDuration, sameSite: 'Strict'});
    res.redirect('/login#erro');
    //return res.json({ success: false, message: 'Failed to authenticate token.' });
  }
}

module.exports.autenticar = autenticar


var registar = function (req, res) {

  if (config.registar){
    // find the user
    User.findOne({
      name: req.body.newUser
    }, function(err, newuser) {

      if (err) throw err;

      if (!newuser) {
        console.log('ok user não existe');
        var user = req.body.newUser;
        var pss = req.body.newUserPass;
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(pss, salt);
        // create a sample user
        var nick = new User({
          name: user,
          password: hash,
          admin: false,
          permission: true
        });
        // save the sample user
        nick.save(function(err) {
          if (err) throw err;
          console.log('User saved successfully');
          //res.json({ success: true});
          res.redirect('/login');
        });

      } else if (newuser) {
        console.log('erro user já existe');
        res.redirect('/registar#erro1');
        //res.json({ success: false, message: 'user já existe.' });
      }
    });
  } else {
    res.redirect('/registar?#erro3');
  }

}

module.exports.registar = registar
