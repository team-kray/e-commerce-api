// require necessary NPM packages
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const cors = require('cors')

// require route files
const exampleRoutes = require('./app/routes/example_routes')
const userRoutes = require('./app/routes/user_routes')
const orderRoutes = require('./app/routes/order_routes')
const itemRoutes = require('./app/routes/item_routes')

// require error handling middleware
const errorHandler = require('./lib/error_handler')

// require database configuration logic
// `db` will be the actual Mongo URI as a string
const db = require('./config/db')

// load secret keys for signing tokens from .env
const dotenv = require('dotenv')
dotenv.config()

const publishable = process.env.PUBLISHABLE_KEY
const secret = process.env.SECRET_KEY
const stripe = require('stripe')(secret)

// require configured passport authentication middleware
const auth = require('./lib/auth')

// establish database connection
mongoose.Promise = global.Promise
mongoose.connect(db, {
  useMongoClient: true
})

// instantiate express application object

const app = express()
// configure Express to use Pug as the view engine and add the body-parser
// module, which makes it possible for your POST route to receive parameters
// from Checkout.
app.set('view engine', 'pug')
app.use(require('body-parser').urlencoded({extended: false}))

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:7165' }))

// define port for API to run on
const port = process.env.PORT || 4741

// this middleware makes it so the client can use the Rails convention
// of `Authorization: Token token=<token>` OR the Express convention of
// `Authorization: Bearer <token>`
app.use((req, res, next) => {
  if (req.headers.authorization) {
    const auth = req.headers.authorization
    // if we find the Rails pattern in the header, replace it with the Express
    // one before `passport` gets a look at the headers
    req.headers.authorization = auth.replace('Token token=', 'Bearer ')
  }
  next()
})

// register passport authentication middleware
app.use(auth)

// add `bodyParser` middleware which will parse JSON requests into
// JS objects before they reach the route files.
// The method `.use` sets up middleware for the Express application
app.use(bodyParser.json())
// this parses requests sent by `$.ajax`, which use a different content type
app.use(bodyParser.urlencoded({ extended: true }))

// register route files
app.use(exampleRoutes)
app.use(userRoutes)
app.use(orderRoutes)
app.use(itemRoutes)

// custom stripe routes

// The index route renders the Checkout form and displays it to the user.
// Pass the publishable key into the render function so that the template can
// embed it in the Checkout form markup.

app.get('/', (req, res) =>
  res.render('index.pug', {publishable}))

// The charge route retrieves the email address and card token ID from the POST
// request body. It uses those parameters to create a Stripe customer. Next, it
// invokes the stripe.charges.create method, providing the Customer object as an
// option.

app.post('/charge', (req, res) => {
  let amount = req.body.charge.amount

  stripe.customers.create({
    email: req.body.stripeEmail,
    source: req.body.stripeToken
  })
    .then(customer =>
      stripe.charges.create({
        amount,
        description: 'Sample Charge',
        currency: 'usd',
        customer: customer.id
      }))
    .then(charge => res.render('charge.pug'))
  //  .then(charge => res.send(charge))
    .catch(err => {
      console.log('Error:', err)
      res.status(500).send({error: 'Purchase Failed'})
    })
})

// register error handling middleware
// note that this comes after the route middlewares, because it needs to be
// passed any error messages from them
app.use(errorHandler)

// run API on designated port (4741 in this case)
app.listen(port, () => {
  console.log('listening on port ' + port)
})

// needed for testing
module.exports = app
