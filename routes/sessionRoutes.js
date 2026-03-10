const express = require("express");
const passport = require("passport");
const {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} = require("../controllers/sessionController");

const router = express.Router();

// Registration
router.route("/register").get(registerShow).post(registerDo);

// Logon
router.route("/logon")
  .get(logonShow)
  .post(
    passport.authenticate("local", {
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    }),
    (req, res) => {
      req.flash("success", "Logged in successfully!");
      res.redirect("/");
    }
  );



// Logoff
router.route("/logoff").post(logoff);

module.exports = router;
