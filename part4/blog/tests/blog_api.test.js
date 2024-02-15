const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

const initialBlogs = helper.initialBlogs

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(initialBlogs)
})

describe('when there is initially some blogs saved', () => {

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

})

describe('when a blog is added', () => {
    test('blog is saved to the database', async () => {
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
})

test('deletes the blog from the database', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]
    await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    expect(blogsAtEnd).toHaveLength(
        blogsAtStart.length - 1
    )
})

test('updates the blog in the database', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]
    const newData = {
        title: "New Title",
        url: "New Url",
        likes: blogToUpdate.likes + 1
    }
    await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(newData)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    
    const blogsAtEnd = await helper.blogsInDb()
    const found = blogsAtEnd.find(b => b.id === blogToUpdate.id)
    expect(found).toBeDefined()
    expect(found.title).toBe(newData.title)
    expect(found.url).toBe(newData.url)
    expect(found.likes).toBe(newData.likes)
}, 20000)

afterAll(async () => {
    await mongoose.connection.close()
})