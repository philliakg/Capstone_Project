const mongoose = require('mongoose')

const Schema = mongoose.Schema

const reservationSchema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  accommodation: { type: mongoose.Schema.Types.ObjectId, ref: 'Accommodation', required: true },
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  guests: { type: Number, required: true },
  nights: { type: Number, required: true },
  price: { type: Number, required: true },
  weeklyDiscount: { type: Number, default: 0 },
  cleaningFee: { type: Number, default: 0 },
  serviceFee: { type: Number, default: 0 },
  occupancyTaxes: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Reservation', reservationSchema)
