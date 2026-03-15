// util/seed_db.js
import mongoose from "mongoose";

export async function seedDb() {
  // Optional: add your own seeding logic here
  // This is a safe no-op placeholder for now.
  if (mongoose.connection.readyState === 0) {
    return;
  }
}
