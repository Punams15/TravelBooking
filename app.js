// app.js - Final version for Globetrek EJS project with full security
import dotenv from 'dotenv';
import express from 'express';
import session from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';
import helmet from 'helmet';
import xss from 'xss-clean';
import cookieParser from 'cookie-parser';
import csurf from 'csurf';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import expressLayouts from 'express-ejs-layouts';

// Import MongoDB connection
import connectDB from './db/connect.js';


// Import Passport config
import passportInit from './passport/passportInit.js';
passportInit(passport);

// Routes
import authRoutes from './routes/authRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import inquiryRoutes from './routes/inquiryRoutes.js';  // Inquiry route imported

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------------- SECURITY ----------------
app.use(helmet()); // basic security headers
app.use(xss());    // sanitize user input
app.use(cookieParser()); // needed for cookie-based CSRF
app.set('trust proxy', 1); // if deployed behind a proxy

// Rate limiting: max 100 requests per 15 min
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// ---------------- BODY PARSER ----------------
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // optional for JSON requests

// ---------------- STATIC FILES ----------------
app.use(express.static(path.join(__dirname, 'public')));

// ---------------- SESSION ----------------
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'defaultsecret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
  })
);

// ---------------- PASSPORT ----------------
app.use(passport.initialize());
app.use(passport.session());

// ---------------- FLASH MESSAGES ----------------
app.use(flash());

// ---------------- CSRF ----------------

app.use(
  csurf({
    cookie: true,
    ignoreMethods: ['GET', 'HEAD', 'OPTIONS'],
  })
);  //This is the correct configuration for EJS apps.


//app.use(csurf()); // Must come after session & cookieParser,Stored in session: Works only if session is stable; token is not visible in cookies

//app.use(
//csurf({
    //cookie: true,
  //})
//);             //Stored in a cookie, More secure, more stable, recommended for modern apps.EVERY request, including GET, must have a valid CSRF cookie.But GET requests should not require CSRF.


// ---------------- RES.LOCALS FOR EJS ----------------
app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.info = req.flash('info');
  res.locals.user = req.user;
  res.locals.csrfToken = req.csrfToken(); // include in all forms : CSRF protection included:available in all forms
  next();
});

// ---------------- VIEW ENGINE ----------------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layouts/main'); // default layout

// ---------------- ROUTES ----------------
app.use('/auth', authRoutes);        // login/register/logout
app.use('/bookings', bookingRoutes); // CRUD for bookings
app.use('/inquiry', inquiryRoutes);  //Route mounting


// ---------------- HOME ----------------
app.get('/', (req, res) => {
  res.render('home');
});

// ---------------- DEBUG ROUTE ----------------
app.get('/test-bookings', (req, res) => {
  console.log('Test bookings route hit!');
  res.send('Test bookings route works!');
});

// ---------------- 404 HANDLER ----------------
app.use((req, res) => {
  res.status(404).send(`Page ${req.url} not found`);
});

// ---------------- ERROR HANDLER ----------------
app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'EBADCSRFTOKEN') {
    return res.status(403).send('Form tampered with.');
  }
  res.status(500).send(err.message);
});

// ---------------- DATABASE + START SERVER ..DB + Server----------------
connectDB(process.env.MONGO_URI)
  .then(() => {
    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => console.error(err));


  //http://localhost:5000/