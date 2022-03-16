module.exports = function () {
  const passport = require("passport");
  const { Teacher } = require("../models/teacher");

  var JwtStrategy = require("passport-jwt").Strategy,
    ExtractJwt = require("passport-jwt").ExtractJwt;

  var opts = {};

  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = "jwtPrivateKey";

  passport.use(
    "teacher-rule",
    new JwtStrategy(opts, function (jwt_payload, done) {
      Teacher.findById({ _id: jwt_payload.id }, function (err, user) {
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
};
