const express = require("express");
const router = express.Router();
const User = require('../models/User.model');

router.get('/users',(req,res)=>{
    User.find()
    .populate("gamesPlayed")
    .then((allUsers)=>{
        res.json(allUsers)
    })
    .catch((err)=>{
        res.status(400).json(err, "No users found")
    })
});

router.get('/users/:_id', (req,res)=>{
    User.findById(req.params._id)
    .then((oneUser)=>{
        res.json(oneUser)
    })
    .catch((err)=>{
        res.status(400).json(err, "No user found")
    })
});

router.post('/users', (req,res) => {
    User.create(req.body)
    .then((newUser)=>{
        res.json(newUser)
    })
    .catch((err)=>{
        res.status(400).json(err, "Unable to create user. Please fill in all required fields.")
    })
});

router.put('/users/:_id', (req,res)=>{
    User.findByIdAndUpdate(req.params._id, req.body, {new:true})
    .then((updatedUser)=>{
        res.json(updatedUser)
    })
    .catch((err)=>{
        res.status(400).json(err, "Unable to edit user")
    })
});

router.delete('/users/:_id', (req,res)=>{
    User.findByIdAndDelete(req.params._id)
    .then((deletedUser)=>{
        res.json("Profile deleted successfully")
        console.log(deletedUser)
    })
    .catch((err)=>{
        res.status(400).json(err, "Unable to delete profile.")
    })
})

module.exports = router;