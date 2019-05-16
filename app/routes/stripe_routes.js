const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')

const keyPublishable = process.env.PUBLISHABLE_KEY
const keySecret = process.env.SECRET_KEY

const stripe = require('stripe')(keySecret)

router.use(require('body-parser').urlencoded({extended: false}))
router.use(bodyParser.json())

router.post('/charges', (req, res) => {
  // set variable with the amount of charge
  let amount = 500

  stripe.customers.create({
    email: 'k@k.com',
    // set as user's email
    source: 'token'
    // set as user's stripe token
  })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: 'Sample charge',
        currency: 'usd',
        customer: customer.id
      }))
    .then(charge => {
      console.log('charge:', charge)
    })
})
