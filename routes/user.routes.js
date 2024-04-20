const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const fileUploader = require("../config/cloudinary.config");

router.get("/users", (req, res) => {
  User.find()
    .populate("gamesPlayed")
    .then((allUsers) => {
      res.json(allUsers);
    })
    .catch((err) => {
      res.status(400).json(err, "No users found");
    });
});

router.get("/users/:_id", (req, res) => {
  User.findById(req.params._id)
    .populate("gamesPlayed")
    .then((oneUser) => {
      console.log(oneUser);
      oneUser.gamesPlayed.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
      });
      res.json(oneUser);
    })
    .catch((err) => {
      res.status(400).json(err, "No user found");
    });
});

router.post("/users", (req, res) => {
  User.create(req.body)
    .then((newUser) => {
      res.json(newUser);
    })
    .catch((err) => {
      res
        .status(400)
        .json(
          err,
          "Unable to create user. Please fill in all required fields."
        );
    });
});

router.post("/upload", fileUploader.single("imageUrl"), (req, res, next) => {
  // console.log("file is: ", req.file)
 
  if (!req.file) {
    next(new Error("No file uploaded!"));
    return;
  }
  
  // Get the URL of the uploaded file and send it as a response.
  // 'fileUrl' can be any name, just make sure you remember to use the same when accessing it on the frontend
  
  res.json({ fileUrl: req.file.path });
});

router.put("/users/:_id", (req, res) => {
  User.findByIdAndUpdate(req.params._id, req.body, { new: true })
    .then((updatedUser) => {
      res.json(updatedUser);
    })
    .catch((err) => {
      res.status(400).json(err, "Unable to edit user");
    });
});

router.delete("/users/:_id", (req, res) => {
  User.findByIdAndDelete(req.params._id)
    .then((deletedUser) => {
      res.json("Profile deleted successfully");
      console.log(deletedUser);
    })
    .catch((err) => {
      res.status(400).json(err, "Unable to delete profile.");
    });
});

module.exports = router;
