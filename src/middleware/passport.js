const passport = require("passport");
const { Strategy, ExtractJwt } = require("passport-jwt");
const User = require("../../models/index").user;
const privateKey = "secret";
const params = {
  secretOrKey: privateKey,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};
module.exports = () => {
  const strategy = new Strategy(params, (payload, done) => {
    User.findOne({ where: { id: payload.id }, raw: true })
      .then(user => {
        if (user) {
          done(null, { ...payload });
        } else done(null, false);
      })
      .catch(err => done(err, false));
  });
  passport.use(strategy);
  return {
    initialize: () => {
      return passport.initialize();
    },
    authenticate: () => {
      return passport.authenticate("jwt", { session: false });
    }
  };
};
