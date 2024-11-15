import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  feedbackId: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
    trim: true,
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  centerId: {
    type: Schema.Types.ObjectId,
    ref: "Center",
    required: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  ratings: {
    type: Number,
    required: true
  },
  reviews: {
    type : String,
    trim: true
  }
});

export const Feedback = mongoose.model("Feedback", feedbackSchema);
