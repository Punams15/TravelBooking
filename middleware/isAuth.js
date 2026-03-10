// middleware/isAuth.js
// protect routes that require login
export default function isAuth(req, res, next) {
  console.log('isAuth check, user:', req.user, 'isAuthenticated:', req.isAuthenticated());
  if (!req.isAuthenticated()) {
    req.flash("error", "You must be logged in to access that page.");
    return res.redirect("/auth/login"); 
  }
  next();
}
