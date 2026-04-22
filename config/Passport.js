import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import jwt from 'jsonwebtoken';
import UserRepository from '../repository/User.js';

const JWT_SECRET = process.env.PASSPORT_SECRET_KEY; // Store this securely, e.g., in an environment variable

// Local strategy for username/password login
passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await UserRepository.findByEmail(username);
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// JWT strategy for token verification
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET
}, async (payload, done) => {
  try {
    const user = await UserRepository.findById(payload.sub, true);
    if (!user) {
      return done(null, false);
    }
    return done(null, user);
  } catch (error) {
    return done(error, false);
  }
}));

// Function to generate a JWT
export const generateToken = (user) => {
  return jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' });
};

export default passport;
