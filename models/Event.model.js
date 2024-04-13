const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case

const resultsSchema = new Schema({
  player:{  
    type: Schema.Types.ObjectId,
    ref: 'User'       
  },
  score:Number
})
const eventSchema = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    description:{
      type:String
    },

    participants: {
      type: [{
          type: Schema.Types.ObjectId,
          ref: 'User'   
        }],
      validate: {
          validator: function(arr) {
              return arr.length <= 8;
          },
          message: 'Americano is full'
      }
  },
    results: [resultsSchema]
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;
