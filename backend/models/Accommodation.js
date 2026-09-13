const mongoose = require('mongoose')

const Schema = mongoose.Schema

const accommodationSchema = new Schema({
  title: { type: String, required: true },
  location: { type: String, required: true },
  description: { type: String, required: true },
  bedrooms: { type: Number, required: true },
  bathrooms: { type: Number, required: true },
  guests: { type: Number, required: true },
  type: { type: String, required: true },
  price: { type: Number, required: true },
  amenities: { type: [String], default: [] },
  images: { type: [String], default: [] },
  weeklyDiscount: { type: Number, default: 0 },
  cleaningFee: { type: Number, default: 0 },
  serviceFee: { type: Number, default: 0 },
  occupancyTaxes: { type: Number, default: 0 },
  host: { type: String, required: true },
  host_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, default: 4.8 },
  reviews: { type: Number, default: 0 },
  enhancedCleaning: { type: Boolean, default: true },
  selfCheckIn: { type: Boolean, default: true }
}, { timestamps: true })

module.exports = mongoose.model('Accommodation', accommodationSchema)
