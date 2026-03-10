// controllers/authController.js
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import passport from 'passport'; 

// -------------------- LOGIN FORM --------------------
export const showLogin = (req, res) => {
  res.render('auth/login', { csrfToken: req.csrfToken() });
};

// -------------------- HANDLE LOGIN --------------------
export const doLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      req.flash('error', 'Incorrect credentials');
      return res.redirect('/auth/login');
    }

    req.logIn(user, (err) => {
      if (err) return next(err);
      // Use "success" key instead of "successFlash"
      req.flash('success', 'Logged in successfully!');
      return res.redirect('/');
    });
  })(req, res, next);
};

// -------------------- REGISTER FORM --------------------
export const showRegister = (req, res) => {
  res.render('auth/register', { csrfToken: req.csrfToken() });
};

// -------------------- REGISTER USER --------------------
export const doRegister = async (req, res) => {
  const { name, email, password, password2 } = req.body;

  if (!name || !email || !password || !password2) {
    req.flash('error', 'All fields are required');
    return res.redirect('/auth/register');
  }

  if (password !== password2) {
    req.flash('error', 'Passwords do not match');
    return res.redirect('/auth/register');
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      req.flash('error', 'Email already registered');
      return res.redirect('/auth/register');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    req.flash('success', 'Registration successful! Please login.');
    res.redirect('/auth/login');

  } catch (err) {
    console.error(err);
    req.flash('error', 'Error registering user');
    res.redirect('/auth/register');
  }
};

// -------------------- LOGOUT --------------------
export const logout = (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    req.flash('success', 'Logged out successfully');
    res.redirect('/');
  });
};

// ======================================================
//                FORGOT PASSWORD SYSTEM
// ======================================================

// -------------------- SHOW FORGOT FORM --------------------
export const showForgot = (req, res) => {
  res.render('auth/forgot', { csrfToken: req.csrfToken() });
};

// -------------------- HANDLE FORGOT (SEND EMAIL) --------------------
export const handleForgot = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'No account found with that email');
      return res.redirect('/auth/forgot');
    }

    // Generate reset token
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken = token;
    user.resetTokenExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    //  DEBUG: Check environment variables
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS);

    // Email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetURL = `http://localhost:5000/auth/reset/${token}`;

    await transporter.sendMail({
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset - GlobeTrek',
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetURL}">${resetURL}</a>
        <p>This link expires in 1 hour.</p>
      `
    });

    req.flash('success', 'Password reset email sent!');
    res.redirect('/auth/login');

  } catch (err) {
    console.error(err);
    req.flash('error', 'Error sending reset email');
    res.redirect('/auth/forgot');
  }
};

// -------------------- SHOW RESET FORM --------------------
export const showReset = async (req, res) => {
  const { token } = req.params;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Reset link is invalid or expired');
    return res.redirect('/auth/forgot');
  }

  res.render('auth/reset', { csrfToken: req.csrfToken(), token });
};

// -------------------- HANDLE RESET PASSWORD --------------------
export const handleReset = async (req, res) => {
  const { token } = req.params;
  const { password, password2 } = req.body;

  if (password !== password2) {
    req.flash('error', 'Passwords do not match');
    return res.redirect(`/auth/reset/${token}`);
  }

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Reset link is invalid or expired');
    return res.redirect('/auth/forgot');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpire = undefined;

  await user.save();

  req.flash('success', 'Password reset successful! Please login.');
  res.redirect('/auth/login');
};