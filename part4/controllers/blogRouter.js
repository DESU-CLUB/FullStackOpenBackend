blogRouter = require('express').Router()
Blog=  require("../models/blog")
logger= require('../utils/logger')

blogRouter.get('/',(req,res)=>{
    Blog.find({})
    .then(post =>{
        res.json(post)
    })
})

blogRouter.post('/',(req,res,next)=>{
    const body = req.body
    post = new Blog ({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: 0

    })
    post.save()
    .then(result => res.json(result))
    .catch(err => next(err))
})


blogRouter.get('/:id',(req,res,next)=>{
    Blog.findById(req.params.id)
    .then(result =>{
        if (result){
            res.json(result)
        }
        else{
            res.status(404).json({error:"Invalid ID"})
        }
    })
    .catch(err => next(err))
})



module.exports = blogRouter