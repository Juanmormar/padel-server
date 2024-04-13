const express = require("express");
const router = express.Router();
const Event = require("../models/Event.model");
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
    .then((oneEvent) => {
      res.json(oneEvent);
    })
    .catch((err) => {
      res.status(400).json(err, "No event found.");
      console.log(err);
    });
});

router.post("/events", (req, res) => {
  Event.create(req.body)
    .then((newEvent) => {
      res.json(newEvent);
    })
    .catch((err) => {
      res
        .status(400)
        .json(err, "Unable to create event, fill out all compulsory fields.");
      console.log(err);
    });
});

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

// route to join event
router.put("/events/:_id/join", isAuthenticated, (req, res) => {
  Event.findByIdAndUpdate(
    req.params._id,
    { $addToSet: { participants: req.payload._id } },
    { new: true }
  )
    .populate({ path: "participants", select: "-password" })
    .then((updatedEvent) => {
      res.json(updatedEvent);
      console.log("join");
    })
    .catch((err) => {
      res.status(400).json(err, "Unable to edit event");
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
