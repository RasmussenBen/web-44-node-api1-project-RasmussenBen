// BUILD YOUR SERVER HERE
const express = require('express')
const server = express()
server.use(express.json())
const User = require('./users/model')

server.get('/api/users', (req, res) => {
    User.find()
        .then(users => {
            res.json(users)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error getting users',
                err: err.message
            })
        })
})

server.get('/api/users/:id', (req, res) => {
    User.findById(req.params.id)
        .then(user => {
            if (!user) {
                res.status(404).json({
                    message: `{ message: "The user with the specified ID does not exist" }`
                })
            }
            res.json(user)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error getting user',
                err: err.message
            })
        })
})

server.post('/api/users', (req, res) => {
    const user = req.body
    if (!user.name || !user.bio) {
        res.status(400).json({
            message: 'Please provide name and bio for the user'
        })
    }
    User.insert(user)
        .then(createdUser => {
            res.status(201).json(createdUser)
        })
        .catch(err => {
            res.status(500).json({
                message: 'error creating user',
                err: err.message
            })
        })
})

server.put('/api/users/:id', async (req, res) => {
    const possibleUser = await User.findById(req.params.id)
    if (!possibleUser) {
        res.status(404).json({
            message: 'The user with the specified ID does not exist'
        })
    }
    if (!req.body.name || !req.body.bio) {
        res.status(400).json({
            message: 'Please provide name and bio for the user'
        })
    }
    const updatedUser = await User.update(req.params.id, req.body)
    res.status(200).json(updatedUser)
})

server.delete('/api/users/:id', async (req, res) => {
    const possibleUser = await User.findById(req.params.id)
    if (!possibleUser) {
        res.status(404).json({
            message: 'The user with the specified ID does not exist'
        })
    }
    const deletedUser = await User.remove(req.params.id)
    res.status(200).json(deletedUser)
})

server.use('*', (req, res) => {
    res.status(404).json({
        message: 'not found'
    })
})

module.exports = server; // EXPORT YOUR SERVER instead of {}
