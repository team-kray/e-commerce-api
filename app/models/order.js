const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({
  open: {
    type: Boolean,
    required: true
  },
  item: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Item',
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('Order', orderSchema)