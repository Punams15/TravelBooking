// store flash messages and logged-in user info for all views
const storeLocals = (req, res, next) => {
  res.locals.user = req.user || null;        // current logged-in user
  res.locals.info = req.flash("info") || []; // info messages
  res.locals.errors = req.flash("error") || []; // error messages
  next();
};

module.exports = storeLocals;



