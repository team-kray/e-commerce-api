// Express docs: http://expressjs.com/en/api.html
const express = require('express')
const passport = require('passport')
const Item = require('../models/item')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /items
router.get('/items', (req, res, next) => {
  Item.find()
    .then(items => {
      return items.map(item => item.toObject())
    })
    .then(items => res.status(200).json({ items: items }))
    .catch(next)
})

// SHOW
// GET /items/5a7db6c74d55bc51bdf39793
router.get('/items/:id', (req, res, next) => {
  Item.findById(req.params.id)
    .then(handle404)
    .then(item => res.status(200).json({ item: item.toObject() }))
    .catch(next)
})

// // CREATE
// // POST /items
router.post('/items', requireToken, (req, res, next) => {
  req.body.item.owner = req.user.id
  Item.create(req.body.item)
    .then(item => {
      res.status(201).json({ item: item.toObject() })
    })
    .catch(next)
})

// // UPDATE
// // PATCH /items/5a7db6c74d55bc51bdf39793
router.patch('/items/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.item.owner
  Item.findById(req.params.id)
    .then(handle404)
    .then(item => {
      return item.update(req.body.item)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /items/5a7db6c74d55bc51bdf39793
router.delete('/items/:id', requireToken, (req, res, next) => {
  Item.findById(req.params.id)
    .then(handle404)
    .then(item => {
      item.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
