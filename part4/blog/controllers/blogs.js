const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  logger.info(`db blogs: ${blogs}`)
  response.json(blogs)
  // logger.error(error)
})

blogsRouter.post('/', (request, response) => {
  logger.info(`post request body:`, request.body)
  const item = {
    likes: request.body.likes || 0,
    ...request.body
  }
  if (!item.title || !item.url) {
    return response.status(404).end()
  }
  const blog = new Blog(item)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
    .catch(error => {
        logger.error(error)
    })
})

module.exports = blogsRouter