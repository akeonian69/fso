const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = helper.initialBlogs

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(initialBlogs[0])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[1])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[2])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[3])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[4])
  await blogObject.save()
  blogObject = new Blog(initialBlogs[5])
  await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 10000)

test('there are 6 blogs', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body).toHaveLength(initialBlogs.length)
}, 10000)

test('blog has id property', async () => {
    const response = await api.get('/api/blogs')
    const blog = response.body[0]
    expect(blog.id).toBeDefined()
}, 10000)

test('blog is added on post', async () => {
    const blog = {
        title: "Test Blog",
        author: "Chan Michael",
        url: "https://reactpatterns.com/",
        likes: 4
    }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
    const savedItem = blogsAtEnd.find(b => {
        return b.title === blog.title &&
            b.author === blog.author &&
            b.url === blog.url &&
            b.likes === blog.likes
    })
    expect(savedItem).toBeDefined()
}, 10000)

test('blog likes default to zero if not defined', async () => {
    const blog = {
        title: "Test Blog",
        author: "Chan Michael",
        url: "https://reactpatterns.com/",
    }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(initialBlogs.length + 1)
    const savedItem = blogsAtEnd.find(b => {
        return b.title === blog.title &&
            b.author === blog.author &&
            b.url === blog.url
    })
    expect(savedItem.likes).toBe(0)
}, 10000)

test('response bad request if title is missing from blog', async () => {
    const blog = {
        author: "Chan Michael",
        url: "https://reactpatterns.com/",
    }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(404)
}, 20000)

test('response bad request if url is missing from blog', async () => {
    const blog = {
        title: "Test Blog",
        author: "Chan Michael"
    }
    await api
        .post('/api/blogs')
        .send(blog)
        .expect(404)
    
}, 20000)

afterAll(async () => {
    await mongoose.connection.close()
})