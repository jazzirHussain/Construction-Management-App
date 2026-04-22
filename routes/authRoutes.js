import express from 'express'
import passport from 'passport';
import UserController from '../controllers/User.js';
import { generateToken } from '../config/Passport.js';

const router = express.Router();

// router.post('/login', passport.authenticate('local', {
//   // successRedirect: '/',
//   failureRedirect: '/login',
// }));

// Login Route
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {    
    if (err) { return next(err); }
    if (!user) { return res.status(401).json({ loggedIn: false, message: info?.message }); }

    // Generate JWT token after successful login
    const token = generateToken(user);
    return res.status(200).json({ loggedIn: true, user, token });
  })(req, res, next);
});

// Check Authentication Route
router.get('/check', passport.authenticate('jwt', { session: false }), (req, res) => {
  if (req.user) {
    // User is authenticated, return user info
    res.status(200).json({ loggedIn: true, user: req.user });
  } else {
    // User is not authenticated
    res.status(200).json({ loggedIn: false });
  }
});


router.post('/forgot_password', UserController.forgotPassword);

router.post('/change_password', UserController.changePassword);

router.post('/verify_token/:token', UserController.verifyResetToken);

export default router