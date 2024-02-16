const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')

usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({}).populate('blogs')

    response.json(users)
})

usersRouter.post('/', async (request, response) => {
    logger.info(request)
    const { username, name, password } = request.body

    if (username.length < 3) {
        const error = {
            error: "Username should be at least 3 characters long"
        }
        return response.status(404).json(error).end()
    }
    if (password.length < 3) {
        const error = {
            error: "Password should be at least 3 characters long"
        }
        return response.status(404).json(error).end()
    }
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        username,
        name,
        passwordHash,
    })

    try {
        const savedUser = await user.save()
        response.status(201).json(savedUser).end()
    } catch (error) {
        if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
            return response.status(400).json({ error: 'expected `username` to be unique' })
        } else {
            return response.status(400).json({ error: error.message })
        }
    }
})

module.exports = usersRouter