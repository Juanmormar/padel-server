const { Schema, model } = require("mongoose");
const express = require('express');
const app = express();
app.use(express.static('public'));

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required."],
  },
  username: {
    type: String,
    unique: true,
    required: [true, "Username is required."],
  },
  name: { type: String },
  profilePhoto: {
    type: String,
    default:
      "/UserPhoto1.png",
  },
  totalScore: {
    type: Number,
    min: 0,
    default: "0",
  },
  description: { type: String },
  gamesPlayed: [
    {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
  ],
});

const User = model("User", userSchema);

module.exports = User;
