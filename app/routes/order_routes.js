// Express docs: http://expressjs.com/en/api.html
const express = require('express')
const passport = require('passport')
const Order = require('../models/order')
const customErrors = require('../../lib/custom_errors')
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', { session: false })

const router = express.Router()

// INDEX
// GET /orders
// need to use requireToken here
router.get('/orders', (req, res, next) => {
  Order.find({open: false})
  // Order.find()
    .populate('owner')
    .populate('item')
    .then(orders => {
      // requireOwnership(req, orders)
      return orders.map(order => order.toObject())
    })
    .then(orders => res.status(200).json({ orders: orders }))
    .catch(next)
})

// SHOW
// GET /orders/5a7db6c74d55bc51bdf39793
router.get('/orders/:id', requireToken, (req, res, next) => {
  Order.findById(req.params.id)
    .then(handle404)
    .then(order => res.status(200).json({ order: order.toObject() }))
    .catch(next)
})

// CREATE
// POST /orders
router.post('/orders', requireToken, (req, res, next) => {
  req.body.order.owner = req.user.id
  Order.create(req.body.order)
    .then(order => {
      res.status(201).json({ order: order.toObject() })
    })
    .catch(next)
})

// UPDATE
// PATCH /orders/5a7db6c74d55bc51bdf39793
router.patch('/orders/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.order.owner
  Order.findById(req.params.id)
    .then(handle404)
    .then(order => {
      requireOwnership(req, order)
      order.items.push(req.body.order.items)
      return order.save(req.body.order)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.patch('/orders/delete/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.order.owner
  Order.findById(req.params.id)
    .then(handle404)
    .then(order => {
      requireOwnership(req, order)
      order.items.push(req.body.order.items)
      return order.update(req.body.order)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

router.patch('/orders/close/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.order.owner
  Order.findById(req.params.id)
    .then(handle404)
    .then(order => {
      return order.update(req.body.order)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

// DESTROY
// DELETE /orders/5a7db6c74d55bc51bdf39793
router.delete('/orders/:id', requireToken, (req, res, next) => {
  Order.findById(req.params.id)
    .then(handle404)
    .then(order => {
      requireOwnership(req, order)
      order.remove()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
