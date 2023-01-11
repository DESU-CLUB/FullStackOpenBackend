const bcrypt = require('bcrypt')
const { response } = require('express')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.post('/', async (req,res)=>{
    const {username,name,password} = req.body
    
    if (password.length<3){
        res.status(400).json({error:"Invalid password length"})
    }

    existingName = await User.findOne({username})
    if (existingName){
        res.status(400).json({error:"User exists"})
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password,saltRounds) //hash password

    const user = new User({ //make user
        username,
        name,
        passwordHash
    })

    const savedUser=  await user.save()
    console.log(savedUser)
    res.status(201).json(savedUser)
})



userRouter.get('/', async (req,res)=>{
    const result = await User.find({}).populate('blog')
    res.json(result)
})

userRouter.delete('/',async (req,res)=>{
    await User.deleteMany({})
    res.status(204)
})

module.exports = userRouter