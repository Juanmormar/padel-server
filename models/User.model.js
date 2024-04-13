const { Schema, model } = require("mongoose");

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
    required: [true, "Username is required."],
  },
  name: { type: String },
  profilePhoto: {
    type: String,
    default:
      "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg",
  },
  totalScore: {
    type: Number,
    min: 0,
    default: "0",
  },
  description: { type: String },
  gamesPlayed: {
    type: Schema.Types.ObjectId,
    ref: "Event",
  },
});

const User = model("User", userSchema);

module.exports = User;
