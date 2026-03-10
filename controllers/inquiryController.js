import Inquiry from "../models/Inquiry.js";
import nodemailer from "nodemailer";

export const submitInquiry = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Save inquiry to database
    await Inquiry.create({ name, email, message });

    // Email transporter (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Send email to YOU
    await transporter.sendMail({
      from: `"Globetrek Inquiry" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // your inbox
      subject: "New Inquiry Received",
      html: `
        <h2>New Inquiry from Globetrek</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    req.flash("success", "Your inquiry has been submitted!");
    res.redirect("/");
  } catch (err) {
    console.error(err);
    req.flash("error", "Unable to submit inquiry.");
    res.redirect("/");
  }
};
