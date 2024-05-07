const express = require("express");
const router = express.Router();
const Event = require("../models/Event.model");
const User = require("../models/User.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/events", (req, res) => {
  Event.find()
    .populate({ path: "participants", select: "-password" })
    .then((allEvents) => {
      res.json(allEvents);
    })
    .catch((err) => {
      res.status(400).json(err, "No events found.");
      console.log(err);
    });
});

router.get("/events/:_id", (req, res) => {
  Event.findById(req.params._id)
    .populate({ path: "participants", select: "-password" })
    .populate({ path: "organizer", select: "-password" })
    .populate("comments")
    .then((oneEvent) => {
      res.json(oneEvent);
    })
    .catch((err) => {
      res.status(400).json(err, "No event found.");
      console.log(err);
    });
});

router.post("/events", async (req, res) => {
  try {
    const { name, date, description, organizer } = req.body;
    if (!name || !date || !description || !organizer) {
      return res
        .status(400)
        .json({
          message:
            "Please provide all required fields (name, date and description).",
        });
    }

    const newEvent = await Event.create(req.body);
    const updatedUser = await User.findByIdAndUpdate(req.body.organizer, {
      $push: { gamesPlayed: newEvent._id },
    });

    res.json(newEvent);
  } catch (err) {
    res
      .status(400)
      .json(err, "Unable to create event, fill out all compulsory fields.");
    console.log(err);
  }
});

// router.post("/events", (req, res) => {
//   Event.create(req.body)
//     .then((newEvent) => {
//       return User.findByIdAndUpdate(req.body.organizer, {
//         $push: { gamesPlayed: newEvent._id },
//       });
//     })
//     .then((updatedUser) => {
//       res.json(updatedUser);
//     })
//     .catch((err) => {
//       res
//         .status(400)
//         .json(err, "Unable to create event, fill out all compulsory fields.");
//       console.log(err);
//     });
// });

router.put("/events/:_id", (req, res) => {
  Event.findByIdAndUpdate(req.params._id, req.body, { new: true })
    .populate({ path: "participants", select: "-password" })
    .then((updatedEvent) => {
      res.json(updatedEvent);
    })
    .catch((err) => {
      res.status(400).json(err, "Unable to edit event");
    });
});

router.put("/events/:_id/results", async (req, res) => {
  console.log("recBody", req.body);
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params._id,
      { results: req.body },
      { new: true }
    );
    console.log(updatedEvent);
    // Update totalScore for each user
    req.body.map(async (element) => {
      console.log("Updating user", element.player, "with score", element.score);
      await User.findByIdAndUpdate(element.player, {
        $inc: { totalScore: element.score },
      });
    });
    res.status(200).json({ message: "Results updated successfully" });
  } catch (error) {
    console.error("Error updating results:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// router.put("/events/:_id/results", async (req,res)=>{
//   console.log("recBody",req.body)
//   const updatedEvent = await Event.findByIdAndUpdate(req.params._id, {results:req.body}, {new:true})
//   req.body.map(async(element)=> {
//      await User.findByIdAndUpdate(element.player,{totalScore:element.score})
//    })
//    res.json("Success")
// })

// route to join event
router.put("/events/:_id/join", isAuthenticated, (req, res) => {
  const eventId = req.params._id;
  const userId = req.payload._id;

  Event.findById(eventId)
  .then((fullEvent)=>{
    if (fullEvent.participants>=8){
      res.json({error:"Sorry Americano is full, only 8 people per Americano"})
      return
    }
  })
  
  Event.findByIdAndUpdate(
    eventId,
    { $addToSet: { participants: userId } },
    { new: true }
  )
    .populate({ path: "participants", select: "-password" })
    .then((updatedEvent) => {
      User.findByIdAndUpdate(
        userId,
        { $addToSet: { gamesPlayed: eventId } },
        { new: true }
      )
        .then((updatedUser) => {
          res.json({
            event: updatedEvent,
            user: {
              id: updatedUser._id,
              gamesPlayed: updatedUser.gamesPlayed,
            },
          });
          console.log("User updated with new event");
        })
        .catch((userErr) => {
          console.error("Error updating user gamesPlayed", userErr);
          res
            .status(500)
            .json({ message: "Error updating user gamesPlayed", userErr });
        });
    })
    .catch((err) => {
      console.error("Unable to edit event", err);
      res.status(400).json({ message: "Unable to edit event", err });
    });
});




router.put("/events/:_id/leave", isAuthenticated, (req, res) => {
  const eventId = req.params._id;
  const userId = req.payload._id;
  Event.findByIdAndUpdate(
    eventId,
    { $pull: { participants: userId } },
    { new: true }
  )
    .populate({ path: "participants", select: "-password" })
    .then((updatedEvent) => {
      User.findByIdAndUpdate(
        userId,
        { $pull: { gamesPlayed: eventId } },
        { new: true }
      )
        .then((updatedUser) => {
          res.json({
            event: updatedEvent,
            user: {
              id: updatedUser._id,
              gamesPlayed: updatedUser.gamesPlayed,
            },
          });
          console.log("User removed from event");
        })
        .catch((userErr) => {
          console.error("Error updating user gamesPlayed", userErr);
          res
            .status(500)
            .json({ message: "Error updating user gamesPlayed", userErr });
        });
    })
    .catch((err) => {
      console.error("Unable to remove user from event", err);
      res
        .status(400)
        .json({ message: "Unable to remove user from event", err });
    });
});

router.delete("/events/:_id", (req, res) => {
  Event.findByIdAndDelete(req.params._id)
    .then((deletedEvent) => {
      res.json("Event successfully deleted");
      console.log(deletedEvent);
    })
    .catch((err) => {
      res.status(400).json(err, "Unable to delete event");
      console.log(err);
    });
});

module.exports = router;
