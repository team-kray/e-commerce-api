// Express docs: http://expressjs.com/en/api.html
const express = require('express')
const passport = require('passport')
const Cart = require('../models/cart')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// SHOW
// GET /carts/5a7db6c74d55bc51bdf39793
router.get('/carts/:id', (req, res, next) => {
  Cart.findById(req.params.id)
    .then(handle404)
    .then(cart => res.status(200).json({ cart: cart.toObject() }))
    .catch(next)
})

// // CREATE
// // POST /carts
router.post('/carts', requireToken, (req, res, next) => {
  req.body.item.owner = req.user.id
  Cart.create(req.body.item)
    .then(cart => {
      res.status(201).json({ cart: cart.toObject() })
    })
    .catch(next)
})

// // UPDATE
// // PATCH /items/5a7db6c74d55bc51bdf39793
router.patch('/cart/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.item.owner
  Cart.findById(req.params.id)
    .then(handle404)
    .then(cart => {
      requireOwnership(req, cart)
      console.log('items before push', cart.items)
      cart.items.push(req.body.cart.items)
      console.log('items after push', cart.items)
      return cart.update(req.body.cart)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /items/5a7db6c74d55bc51bdf39793
router.delete('/carts/:id', requireToken, (req, res, next) => {
  Cart.findById(req.params.id)
    .then(handle404)
    .then(cart => {
      cart.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
