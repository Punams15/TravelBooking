const User = require("../models/User");
const parseVErr = require("../util/parseValidationErr");

const registerShow = (req, res) => {
  res.render("register");
};

const registerDo = async (req, res, next) => {
  if (req.body.password !== req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register");
  }

  try {
    await User.create(req.body);
    req.flash("info", "Registration successful! You can now log in.");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    return res.render("register");
  }

  res.redirect("/sessions/logon");
};

const logonShow = (req, res) => {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon");
};

const logoff = (req, res) => {
  req.logout((err) => {   // using passport logout
    if (err) console.error(err);
    req.flash("info", "You have logged out.");
    res.redirect("/");
  });
};

module.exports = {
  registerShow,
  registerDo,
  logonShow,
  logoff,
};
