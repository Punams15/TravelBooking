import Booking from "../models/Booking.js";
// =========================
// GET ALL BOOKINGS
// (Sorting + Filtering + Pagination)
// =========================
export const getAllBookings = async (req, res) => {
  try {
    const filter = { createdBy: req.user._id };

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = 5;
    const skip = (page - 1) * limit;

    // Status Filtering
    if (req.query.status && req.query.status !== "all") {
      filter.status = req.query.status;
    }

    // Sorting
    let sort = {};
    switch (req.query.sort) {
      case "oldest":
        sort = { createdAt: 1 };
        break;
      case "alpha":
        sort = { hotelName: 1 };
        break;
      case "alpha-desc":
        sort = { hotelName: -1 };
        break;
      default:
        sort = { createdAt: -1 }; // newest
    }

    // Count total bookings for pagination
    const totalBookings = await Booking.countDocuments(filter);

//const bookings = await Booking.find(filter).sort(sort); //fix All uppercase letters first (A–Z) and all lowercase letters (a–z)

    // Fetch bookings
    const bookings = await Booking.find(filter)
      .collation({ locale: "en", strength: 1 }) // case-insensitive sorting
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Booking range for UI display
    const startBooking = totalBookings === 0 ? 0 : skip + 1;
    const endBooking = skip + bookings.length;

    res.render("bookings/index", {
      bookings,
      sort: req.query.sort || "newest",
      status: req.query.status || "all",
      currentPage: page,
      totalPages: Math.ceil(totalBookings / limit),
      startBooking,
      endBooking,
      totalBookings,
      csrfToken: req.csrfToken()
    });

  } catch (err) {
    console.error(err);
    req.flash("error", "Cannot fetch bookings");
    res.redirect("/");
  }
};


// =========================
// SHOW NEW BOOKING FORM
// =========================
export const showNewBookingForm = (req, res) => {
  res.render("bookings/new", {
    booking: null,
    csrfToken: req.csrfToken()
  });
};


// =========================
// CREATE BOOKING
// =========================
export const createBooking = async (req, res) => {
  try {

    const {
      hotelName,
      location,
      checkInDate,
      checkOutDate,
      guests,
      price,
      notes,
      status
    } = req.body;

    const booking = new Booking({
      hotelName,
      location,
      checkInDate,
      checkOutDate,
      guests,
      price,
      notes,
      status,
      createdBy: req.user._id
    });

    await booking.save();

    req.flash("success", "Booking created successfully!");
    res.redirect("/bookings");

  } catch (err) {
    console.error(err);
    req.flash("error", err.message || "Error creating booking");
    res.redirect("/bookings/new");
  }
};


// =========================
// SHOW EDIT FORM
// =========================
export const showEditBookingForm = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.createdBy.toString() !== req.user._id.toString()) {
      req.flash("error", "Unauthorized access");
      return res.redirect("/bookings");
    }

    res.render("bookings/edit", {
      booking,
      csrfToken: req.csrfToken()
    });

  } catch (err) {
    console.error(err);
    req.flash("error", "Cannot load booking");
    res.redirect("/bookings");
  }
};


// =========================
// UPDATE BOOKING
// =========================
export const updateBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.createdBy.toString() !== req.user._id.toString()) {
      req.flash("error", "Unauthorized access");
      return res.redirect("/bookings");
    }

    const {
      hotelName,
      location,
      checkInDate,
      checkOutDate,
      guests,
      price,
      notes,
      status
    } = req.body;

    booking.hotelName = hotelName;
    booking.location = location;
    booking.checkInDate = checkInDate;
    booking.checkOutDate = checkOutDate;
    booking.guests = guests;
    booking.price = price;
    booking.notes = notes;
    booking.status = status;

    await booking.save();

    req.flash("success", "Booking updated successfully!");
    res.redirect("/bookings");

  } catch (err) {
    console.error(err);
    req.flash("error", err.message || "Error updating booking");
    res.redirect("/bookings");
  }
};


// =========================
// INLINE STATUS UPDATE
// =========================
export const updateBookingStatus = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.createdBy.toString() !== req.user._id.toString()) {
      req.flash("error", "Unauthorized access");
      return res.redirect("/bookings");
    }

    booking.status = req.body.status;
    await booking.save();

    req.flash("success", "Status updated!");
    res.redirect("/bookings");

  } catch (err) {
    console.error(err);
    req.flash("error", "Error updating status");
    res.redirect("/bookings");
  }
};


// =========================
// DELETE BOOKING
// =========================
export const deleteBooking = async (req, res) => {
  try {

    const booking = await Booking.findById(req.params.id);

    if (!booking || booking.createdBy.toString() !== req.user._id.toString()) {
      req.flash("error", "Unauthorized access");
      return res.redirect("/bookings");
    }

    await booking.deleteOne();

    req.flash("success", "Booking deleted successfully!");
    res.redirect("/bookings");

  } catch (err) {
    console.error(err);
    req.flash("error", "Error deleting booking");
    res.redirect("/bookings");
  }
};

