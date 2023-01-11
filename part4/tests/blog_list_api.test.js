const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Blog = require('../models/blog')
const helper=  require('./api_helper')
const api = supertest(app)
const bcrypt = require('bcrypt')
const userRouter = require('../controllers/userRouter')
const { findOneAndUpdate } = require('../models/blog')

beforeEach(async()=>{
    console.log('Deleting all posts')
    await Blog.deleteMany({})
    await User.deleteMany({})
    


    for (let obj of helper.initBlogs){
        let newobj = new Blog(obj)
        
        await newobj.save()

    }

    for (let obj of helper.initialUser){
        let newobj = new User(obj)
        console.log(obj.password)
        newobj.passwordHash = await bcrypt.hash(obj.password,10)
        console.log(newobj.passwordHash)

        await newobj.save()
    }

})

describe('Fetching resources',()=>{

    test('Get API working for resource repository?',async ()=>{
        const res = await api
                            .get('/api/blog')
                            .expect(200)
                            .expect('Content-Type',/application\/json/)
        expect(res.body).toHaveLength(helper.initBlogs.length)
    })

    test('Does ID property exist on individual resource?',async ()=>{
        const res = await api
                            .get('/api/blog/12')
                            .expect(400)
                            .expect('Content-Type',/application\/json/)
        console.log(res.error)
    })


    test('Does ID property exist?',async ()=>{
        const res = await api
                            .get('/api/blog')
                            .expect(200)
                            .expect('Content-Type',/application\/json/)
        expect(res.body[0].id).toBeDefined()
    })

})
describe('Adding new blogs',()=>{
    test.only("Does POST work w/o token?", async () =>{
        let newBlog = {
            title: "The Few, The Proud, The Stupid",
            author:"Samuel D. Witkins",
            url: "joinSAF.com",
            likes:0
        }
        console.log(newBlog)
        const err = await api.post('/api/blog')
        .send(newBlog)
        .expect(401)
        .expect('Content-Type', /application\/json/)
        console.log(err.error)
        const res = await helper.getBlogsfromDB()
        expect(res).toHaveLength(helper.initBlogs.length)
    })

    test.only("Does POST work with token?", async () =>{
        let newBlog = {
            title: "The Few, The Proud, The Stupid",
            author:"Samuel D. Witkins",
            url: "joinSAF.com",
            likes:0
        }
        user = {
            username: "John",
            name: "Johnny",
            password:"Gohnny"
              }
        const tokenresult = await api.post('/api/login')
                                .send(user)
                                .expect(201)
        const token = tokenresult.body.token
        console.log(token)
        const err = await api.post('/api/blog')
        .set("Authorization",`bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        console.log(err.error)
        const res = await helper.getBlogsfromDB()
        expect(res).toHaveLength(helper.initBlogs.length +1)
        content = res.map(obj => obj.title)
        expect(content).toContainEqual("The Few, The Proud, The Stupid")
    })


    test.only("Does LIKE property default to 0 work?", async () =>{
        let newBlog = {
            author:"Samuel D. Witkins",
            title: "The Few, The Proud, The Stupid",
            url: "joinSAF.com",
        }
        user = {
            username: "John",
            name: "Johnny",
            password:"Gohnny"
              }
        const tokenresult = await api.post('/api/login')
                                .send(user)
                                .expect(201)
        const token = tokenresult.body.token
        console.log(token)
        await api.post('/api/blog')
        .send(newBlog)
        .set("Authorization",`bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
        const res = await helper.getBlogsfromDB()
        const newTitle = res.filter(obj => obj.title === "The Few, The Proud, The Stupid")
        expect(newTitle[0].likes).toBeDefined()
    })


    


    test.only("Does Invalid input work", async () =>{
        let newBlog = {
            author:"",
            title: "The Few, The Proud, The Stupid",
            url: "joinSAF.com",
        }
        user = {
            username: "John",
            name: "Johnny",
            password:"Gohnny"
              }
        const tokenresult = await api.post('/api/login')
                                .send(user)
                                .expect(201)
        const token = tokenresult.body.token
        console.log(token)

        const err = await api.post('/api/blog')
                        .set("Authorization",`bearer ${token}`)
                        .send(newBlog)
                        .expect(400)
                        })

})

describe('Deleting resources',()=>{
    test.only('Deleting valid reosurce',async ()=>{
        const blogs = await helper.getBlogsfromDB()
        const firstBlog = blogs[0]

        
        
        user = await User.findOne({username: "John"})
        
        firstBlog.user = user._id

        await Blog.findByIdAndUpdate(firstBlog.id,firstBlog)

         auth = {username: "John",password: "Gohnny"}
        

        const tokenresult = await api.post('/api/login')
                                .send(auth)
                                .expect(201)
        const token = tokenresult.body.token
        console.log(token)

        await api.delete(`/api/blog/${firstBlog.id}`)
                    .set("Authorization",`bearer ${token}`)
                    .expect(204)

        const newBlogs = await helper.getBlogsfromDB()
        expect(newBlogs).toHaveLength(blogs.length-1)
        newContent = newBlogs.map(obj => obj.title)
        expect(newContent).not.toContainEqual(firstBlog.title)
    })

})

describe('Updating Resources',()=>{
    test("Updating valid resource",async()=>{
        const blogs = await helper.getBlogsfromDB()
        const firstBlog = blogs[0]
        console.log(firstBlog)

        firstBlog.likes = 1

        await api.put(`/api/blog/${firstBlog.id}`)
        .send(firstBlog)
        .expect(200)
        const newBlog = await helper.getBlogsfromDB()
        newContent = newBlog.filter(obj => obj.id === firstBlog.id)
        console.log(newContent)
        expect(newContent[0].likes).toBe(1)
})
})


afterAll(() => {
    mongoose.connection.close()
})