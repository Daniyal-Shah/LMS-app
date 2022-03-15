const { Student } = require("../models/student");

var JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const passport = require("passport");
var opts = {};

opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = "jwtPrivateKey";

passport.use(
  new JwtStrategy(opts, function (jwt_payload, done) {
    Student.findOne({ id: jwt_payload.id }, function (err, user) {
      if (err) {
        return done(err, false);
      }
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
        // or you could create a new account
      }
    });
  })
);