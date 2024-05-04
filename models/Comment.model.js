const { Schema, model } = require("mongoose");


const likeSchema = new Schema({
  user: {
    type: Schema.Types.Mixed,
    ref: "User",
  }
});
const commentSchema = new Schema({
  username: {
    type: String,
    required: [true, "Name is required."],
  },
  name: {
    type: String
  },
  profilePhoto: {
    type: String,
    default: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg"
  },
  message: {
    type: String,
    required: true
  },
  likes: [likeSchema]
}
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;