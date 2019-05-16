const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
  items: [
    {
      item: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item'
      },
      quantity: {
        type: Number,
        min: 0
      }
    }
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Cart', cartSchema)
