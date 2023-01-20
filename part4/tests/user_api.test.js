const { isObject } = require('lodash')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const helper = require('./api_helper')
const api = supertest(app)

beforeEach(async () =>{
    await User.deleteMany({})
    for (let obj of helper.initialUser){
        let userObj = new User(obj)
        await userObj.save()
    }
})

describe('Test for POST',()=>{
    test.only("Can new valid user join?",async()=>{
        const userObj = {username:'eng',name:'hup',password:'ferry'}
        const resp = await api.post('/api/users')
                  .send(userObj)
                  .expect(201)
                  .expect('Content-Type',/application\/json/)
        newUsers = await helper.getUserFromDB()
        expect(newUsers).toHaveLength(helper.initialUser.length+1)
    })
    test("Can invalid user be added?",async ()=>{
        const userObj = {username:'John',name:'hup',password:'ferry'}
        const resp = await api.post('/api/users')
                  .send(userObj)
                  .expect(400)
                  .expect('Content-Type',/application\/json/)
        newUsers = await helper.getUserFromDB()
        expect(newUsers).toHaveLength(helper.initialUser.length)
        
    })
})