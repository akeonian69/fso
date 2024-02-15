const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const logger = require('../utils/logger')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({})
  logger.info(`db blogs: ${blogs}`)
  response.json(blogs)
  // logger.error(error)
})

blogsRouter.post('/', async (request, response) => {
  logger.info(`post request body:`, request.body)
  const item = {
    likes: request.body.likes || 0,
    ...request.body
  }
  if (!item.title || !item.url) {
    return response.status(404).end()
  }
  const blog = new Blog(item)
  try {
    const result = await blog.save()
    response.status(201).json(result)
  } catch(exception) {
    logger.error(error)
  }
})

blogsRouter.delete('/:id', async (request, response) => {
  logger.info(`delete request body:`, request.body)
  const id = request.params.id
  logger.info('params id', id)
  await Blog.findByIdAndDelete(id)
  response.status(204).end() 
})

blogsRouter.put('/:id', async (request, response) => {
  logger.info(`delete request body:`, request.body)
  const id = request.params.id
  logger.info('params id', id)
  const opts = { new: true }
  const result = await Blog.findByIdAndUpdate(id, request.body, opts)
  response.json(result)
})

module.exports = blogsRouter