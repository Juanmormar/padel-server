const express = require("express");
const router = express.Router();
const Event = require('../models/Event.model');

router.get('/events', (req,res)=>{
    Event.find()
    .populate("participants")
    .then((allEvents)=>{
        res.json(allEvents)
    })
    .catch((err)=>{
        res.status(400).json(err, "No events found.")
        console.log(err)
    })
});

router.get('/events/:_id',(req,res)=>{
    Event.findById(req.params._id)
    .populate('participants')
    .then((oneEvent)=>{
        res.json(oneEvent)
    })
    .catch((err)=>{
        res.status(400).json(err, "No event found.")
        console.log(err)
    })
});

router.post('/events', (req,res)=>{
    Event.create(req.body)
    .then((newEvent)=>{
        res.json(newEvent)
    })
    .catch((err)=>{
        res.status(400).json(err, "Unable to create event, fill out all compulsory fields.")
        console.log(err)
    })
});

router.put('/events/:_id', (req,res)=>{
    Event.findByIdAndUpdate(req.params._id, req.body, {new:true})
    .then((updatedEvent)=>{
        res.json(updatedEvent)
    })
    .catch((err)=>{
        res.status(400).json(err, "Unable to edit event")
    })
});

router.delete('/events/:_id', (req,res)=>{
    Event.findByIdAndDelete(req.params.id)
    .then((deletedEvent)=>{
        res.json("Event successfully deleted")
        console.log(deletedEvent)
    })
    .catch((err)=>{
        res.status(400).json(err, "Unable to delete event")
        console.log(err)
    })
})




module.exports = router;