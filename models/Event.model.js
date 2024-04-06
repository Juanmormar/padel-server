const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    description: { type: String },

   

    results: { type: [Object] }

  }
);

const Event = model("Event", eventSchema);

module.exports = Event;
