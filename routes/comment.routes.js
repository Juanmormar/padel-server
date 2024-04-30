const express = require("express");
const router = express.Router();
const Comment = require('../models/Comment.model');
const Event = require("../models/Event.model");


router.get('/comments', (req,res)=>{
    Comment.find()
    .populate('username')
    .then((allComments)=>{
        res.json(allComments)
    })
    .catch((err)=>{
        res.status(400).json(err, "No comments found")
    })
});

router.get('/comments/:_id',(req,res)=>{
    Comment.findById(req.params._id)
    .populate('username')
    .then((oneComment)=>{
        res.json(oneComment)
    })
    .catch((err)=>{
        res.status(400).json(err, "No comment found")
    })
});

router.post('/comments', (req,res)=>{
    Comment.create(req.body)
    .then((newComment)=>
        Event.findByIdAndUpdate(req.body.event, {$addToSet: {comments: newComment._id}}, {new:true})
        .populate("comments")
    )
    .then((commentCreated)=>
        res.json(commentCreated)
    )
    .catch((err)=>{
        res.status(400).json(err, "Unable to post comment, please fill in all the required fields")
    })
});

router.put('/comments/:_id', (req,res)=>{
    Comment.findByIdAndUpdate(req.params._id, req.body, {new:true})
    .then((updatedComment)=>{
        res.json(updatedComment)
    })
    .catch((err)=>{
        res.status(400).json("Unable to edit comment")
    })
});

router.delete('/comments/:_id',(req,res)=>{
    Comment.findByIdAndDelete(req.params._id)
    .then((deletedComment)=>{
        console.log(deletedComment)
        res.json("Comment deleted successfully")
    })
    .catch((err)=>{
        res.status(400).json("Unable to delete comment")    
    })
})


module.exports = router;