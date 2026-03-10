// routes/auth.js
import express from 'express';
import passport from 'passport';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { 
  showLogin, 
  doLogin, 
  showRegister, 
  doRegister, 
  logout
} from '../controllers/authController.js';

const router = express.Router();

// -------------------- LOGIN --------------------
router.get('/login', showLogin);
router.post('/login', doLogin); // uses doLogin from authController

// -------------------- REGISTER --------------------
router.get('/register', showRegister);
router.post('/register', doRegister);

// -------------------- LOGOUT --------------------
router.post('/logout', logout);

// -------------------- FORGOT PASSWORD --------------------
router.get('/forgot', (req, res) => {
  res.render('auth/forgot', { csrfToken: req.csrfToken() });
});

router.post('/forgot', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      req.flash('error', 'Please enter your email.');
      return res.redirect('/auth/forgot');
    }

    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'No account found with that email.');
      return res.redirect('/auth/forgot');
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    const resetURL = `http://${req.headers.host}/auth/reset/${token}`;

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('EMAIL_USER or EMAIL_PASS not set in .env');
      req.flash('error', 'Email service not configured.');
      return res.redirect('/auth/forgot');
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'GlobeTrek Password Reset',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>This link expires in 1 hour.</p>
      `
    });

    req.flash('success', 'Password reset link sent to your email.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Forgot password error:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/forgot');
  }
});

// -------------------- RESET PASSWORD --------------------
router.get('/reset/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'Reset token is invalid or expired.');
      return res.redirect('/auth/forgot');
    }

    res.render('auth/reset', {
      token: req.params.token,
      csrfToken: req.csrfToken()
    });
  } catch (err) {
    console.error('Reset password GET error:', err);
    req.flash('error', 'Something went wrong.');
    res.redirect('/auth/forgot');
  }
});

router.post('/reset/:token', async (req, res) => {
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'Reset token expired.');
      return res.redirect('/auth/forgot');
    }

    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword || password !== confirmPassword) {
      req.flash('error', 'Passwords do not match or are empty.');
      return res.redirect(`/auth/reset/${req.params.token}`);
    }

    user.password = password; // hashed in pre-save hook in User model
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    req.flash('success', 'Password updated successfully. Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error('Reset password POST error:', err);
    req.flash('error', 'Something went wrong. Please try again.');
    res.redirect('/auth/forgot');
  }
});

export default router;