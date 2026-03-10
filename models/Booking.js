import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    hotelName: {
      type: String,
      required: [true, "Hotel name is required"],
      minlength: [2, "Hotel name must be at least 2 characters"],
      maxlength: [100, "Hotel name cannot exceed 100 characters"],
      trim: true,
    },

    location: {
      type: String,
      required: [true, "Location is required"],
      minlength: [2, "Location must be at least 2 characters"],
      maxlength: [100, "Location cannot exceed 100 characters"],
      trim: true,
    },

    checkInDate: {
      type: Date,
      required: [true, "Check‑in date is required"],
    },

    checkOutDate: {
      type: Date,
      required: [true, "Check‑out date is required"],
      validate: {
        validator: function (value) {
          return value > this.checkInDate;
        },
        message: "Check‑out date must be after check‑in date",
      },
    },

    guests: {
      type: Number,
      required: [true, "Number of guests is required"],
      min: [1, "At least 1 guest is required"],
      max: [20, "Maximum 20 guests allowed"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [1, "Price must be at least 1"],
    },

    notes: {
      type: String,
      maxlength: [300, "Notes cannot exceed 300 characters"],
      trim: true,
    },

    // NEW: Booking status (for filtering)
    status: {
      type: String,
      enum: ["pending", "done", "canceled"],
      default: "pending",
    },

    // Access control: ensures each user sees only their own bookings
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isConfirmed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
