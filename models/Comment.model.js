const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const commentSchema = new Schema({
  username: {
    type: Schema.Types.ObjectId, ref: "User",
    required: [true, "Name is required."],
  },
  name: {
    type: Schema.Types.ObjectId, ref: "User"
  },
  profilePhoto: {
    type: Schema.Types.String, ref: "User",
    default: "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-social-media-user-vector-default-avatar-profile-icon-social-media-user-vector-portrait-176194876.jpg"
  },
  message: {
    type: String,
    required: true
  }

}
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
