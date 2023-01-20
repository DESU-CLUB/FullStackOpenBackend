const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const Blog=  require("../models/blog")
const User = require('../models/user')
const logger= require('../utils/logger')
const middleware= require("../utils/middleware")


blogRouter.get('/',async (req,res)=>{
    const blogposts = await Blog.find({}).populate('user')
    res.json(blogposts)
})



blogRouter.post('/',middleware.tokenHandler, middleware.userHandler,async (req,res)=>{
    const body = req.body
    console.log(body.title)
    console.log(req.token)
    console.log(req.user)
    //Get original user from token
    if (!req.user){//if null, token is invalid
        return res.status(401).json({error:"token missing/invalid"})
    }
    
    const assignedUser = await User.findById(req.user) //get id of user who submitted token
    post = new Blog ({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: 0,
        user: assignedUser.id

    })
    assignedUser.blog = assignedUser.blog.concat
    

    const result = await post.save()
    assignedUser.blog = assignedUser.blog.concat(result._id)
    await assignedUser.save()

    //get populated version
    const newresult = await Blog.findById(result._id).populate('user')
    res.status(201).json(newresult)
})


blogRouter.get('/:id',async (req,res)=>{
    const result = await Blog.findById(req.params.id)
        if (result){
            res.json(result)
        }
        else{
            res.status(404).json({error:"Invalid ID"})
        }
})

blogRouter.delete('/:id',middleware.tokenHandler,middleware.userHandler, async (req,res)=>{
    const blogid = req.params.id
    const blog = await Blog.findById(blogid)
    console.log(req.user,blog.user)
    if (!blog){
        res.status(400).json({error:"Blog doesn't exist"})
    } 
    
    else if (!(req.user && blog.user) ){
        res.status(401).json({error:"Token/User does not exist"})
    }


    else if (req.user.toString() === blog.user.toString()){
        await Blog.findByIdAndRemove(blogid)
        user = await User.findOne({id: req.user})
        user.blog = user.blog.filter(val => val.toString() !== blogid.toString())
        console.log(user.blog)
        console.log(user.id,user)
        await User.findByIdAndUpdate(user.id,user,{new:true,runValidators:true,context:'query'})
        
        res.status(204).end()
    }
    else{
        res.status(401).json({error:"User/Token does not match"})
    }
})

blogRouter.put('/:id', async (req,res)=>{
    const body = req.body
    newBlog = {title:body.title, author:body.author,url:body.url,likes:body.likes}
    console.log(newBlog)
    result = await Blog.findByIdAndUpdate(req.params.id,newBlog, {new:true,runValidators:true,context:'query'})
    console.log(result)
    res.status(200).json(result)
})

blogRouter.delete('/', async(req,res) =>{
    await Blog.deleteMany({})
    res.status(204).end()
})

module.exports = blogRouter
