const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')


loginRouter.post('/',async (req,res)=>{
    const {username,password} = req.body
	
    const user = await User.findOne({username})
    console.log(user,username,password)
    passwordCorrect = user===null?false: await bcrypt.compare(password,user.passwordHash)
    console.log(passwordCorrect)
    //check if password correct to get token
    if (!(user && passwordCorrect)){
        console.log(username,password)
        return res.status(401).json({error:"Invalid Username or password"})
    }

    const userForToken = { //gets token credentials to use for signing
        username: user.username,
        id: user._id
    }

    const token = jwt.sign(userForToken,process.env.SECRET, {expiresIn:60*60})

    res.status(201).json({token,username:username,name:user.name})

})
module.exports = loginRouter
