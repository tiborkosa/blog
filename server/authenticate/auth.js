const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const config = require('../config');
const checkToken = expressJwt({secret: config.secrets.jwt });
const User = require('../api/user/userModel');

exports.authenticate = (req, res, next) => {
  let token = '';
  if (req.query && req.query.hasOwnProperty('access_token')) {
    token = req.query.access_token;
  } else if(req.headers.authorization) {
    token = req.headers.authorization.substring(7);
  }else{
    return res.status(403).json({ message: "Unauthorized!"});
  }
  try{
    const decoded = jwt.verify(token, config.secrets.jwt);
    User.findById(decoded._id)
      .then( user => {
        if (!user) {
          res.status(403).json({ message: "Unauthorized!"})
        } else {
          req.user = user;
          next();
        }
      }, err => next(err)
    );
  }catch (err){
    return res.status(403).json({ message: "Unauthorized!"})
  }
};

exports.verifyUser = (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  // if no username or password then send
  if (!username || !password) {
    return res.status(422).json({ message: "Username and password required!"});
  }

  // look user up in the DB so we can check
  // if the passwords match for the username
  User.findOne({email: username})
    .then(function(user) {
      if (!user) {
        res.status(422).json({ message: "Invalid username or password!"});
      } else {
        // checking the passowords here
        if (!user.authenticate(password)) {
          res.status(422).json({ message: "Invalid username or password!"});
        } else {
          req.user = user;
          next();
        }
      }
    }, function(err) {
      next(err);
    });
};

// util method to sign tokens on signup
exports.signToken = function(id) {
  return jwt.sign(
    {_id: id},
    config.secrets.jwt,
    { expiresIn: config.expireTime }
  );
};
