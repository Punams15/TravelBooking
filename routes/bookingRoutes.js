// Force redeploy on Render
import express from 'express';
import isAuth from '../middleware/isAuth.js'; // Middleware: protect routes //// Updated import paths for Render deployment

import {
  getAllBookings,
  showNewBookingForm,
  createBooking,
  showEditBookingForm,
  updateBooking,
  deleteBooking,
  updateBookingStatus   //  NEW IMPORT
} from '../controllers/bookingController.js';

const router = express.Router();

// ------------------------
// DEBUG ROUTE (temporary)
// ------------------------
router.get('/debug', isAuth, (req, res) => {
  console.log('GET /bookings/debug called, user:', req.user);
  res.send('Debug booking route works! User: ' + (req.user ? req.user.email : 'not logged in'));
});

// ------------------------
// CRUD Routes for Bookings
// ------------------------

// READ: List all bookings
router.get('/', isAuth, getAllBookings);

// CREATE: Show form
router.get('/new', isAuth, showNewBookingForm);

// CREATE: Handle form submission
router.post('/new', isAuth, createBooking);

// UPDATE: Show edit form
router.get('/edit/:id', isAuth, showEditBookingForm);

// UPDATE: Handle form submission (POST instead of PUT)
router.post('/edit/:id', isAuth, updateBooking);

// INLINE STATUS UPDATE (NEW)
router.post('/update-status/:id', isAuth, updateBookingStatus);

// DELETE: Handle delete (POST instead of DELETE)
router.post('/delete/:id', isAuth, deleteBooking);

export default router;
