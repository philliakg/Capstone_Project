const Accommodation = require('../models/Accommodation')
const mongoose = require('mongoose')

const getAccommodations = async (req, res) => {
  try {
    const filter = {}
    if (req.query.location) {
      filter.location = { $regex: req.query.location, $options: 'i' }
    }
    const accommodations = await Accommodation.find(filter).sort({ createdAt: -1 })
    res.status(200).json(accommodations)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getAccommodation = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such accommodation' })
  }
  const accommodation = await Accommodation.findById(id)
  if (!accommodation) {
    return res.status(404).json({ error: 'No such accommodation' })
  }
  res.status(200).json(accommodation)
}

const parseAmenities = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value
  return String(value).split(',').map((a) => a.trim()).filter(Boolean)
}

const filePaths = (files) => {
  if (!files || !files.length) return []
  return files.map((f) => '/uploads/' + f.filename)
}

const createAccommodation = async (req, res) => {
  const {
    title, location, description, bedrooms, bathrooms, guests,
    type, price, amenities, images, weeklyDiscount, cleaningFee,
    serviceFee, occupancyTaxes, rating, reviews, enhancedCleaning, selfCheckIn
  } = req.body

  if (!title || !location || !description || !bedrooms || !bathrooms || !guests || !type || !price) {
    return res.status(400).json({ error: 'Please fill in all required fields' })
  }

  try {
    const uploaded = filePaths(req.files)
    const imageList = uploaded.length ? uploaded : (Array.isArray(images) ? images : (images ? [images] : []))

    const accommodation = await Accommodation.create({
      title,
      location,
      description,
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      guests: Number(guests),
      type,
      price: Number(price),
      amenities: parseAmenities(amenities),
      images: imageList,
      weeklyDiscount: Number(weeklyDiscount) || 0,
      cleaningFee: Number(cleaningFee) || 0,
      serviceFee: Number(serviceFee) || 0,
      occupancyTaxes: Number(occupancyTaxes) || 0,
      host: req.user.username,
      host_id: req.user._id,
      rating: Number(rating) || 4.8,
      reviews: Number(reviews) || 0,
      enhancedCleaning: enhancedCleaning === false || enhancedCleaning === 'false' ? false : true,
      selfCheckIn: selfCheckIn === false || selfCheckIn === 'false' ? false : true
    })
    res.status(200).json(accommodation)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const updateAccommodation = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such accommodation' })
  }

  const listing = await Accommodation.findById(id)
  if (!listing) {
    return res.status(404).json({ error: 'No such accommodation' })
  }
  if (String(listing.host_id) !== String(req.user._id)) {
    return res.status(403).json({ error: 'Not authorized to update this listing' })
  }

  const updates = { ...req.body }
  if (updates.amenities) updates.amenities = parseAmenities(updates.amenities)
  ;['bedrooms', 'bathrooms', 'guests', 'price', 'weeklyDiscount', 'cleaningFee', 'serviceFee', 'occupancyTaxes', 'rating', 'reviews'].forEach((k) => {
    if (updates[k] !== undefined) updates[k] = Number(updates[k])
  })
  if (updates.enhancedCleaning !== undefined) {
    updates.enhancedCleaning = updates.enhancedCleaning === false || updates.enhancedCleaning === 'false' ? false : true
  }
  if (updates.selfCheckIn !== undefined) {
    updates.selfCheckIn = updates.selfCheckIn === false || updates.selfCheckIn === 'false' ? false : true
  }

  const uploaded = filePaths(req.files)
  if (uploaded.length) {
    updates.images = uploaded
  }

  try {
    const accommodation = await Accommodation.findByIdAndUpdate(id, updates, { new: true })
    res.status(200).json(accommodation)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const deleteAccommodation = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such accommodation' })
  }

  const listing = await Accommodation.findById(id)
  if (!listing) {
    return res.status(404).json({ error: 'No such accommodation' })
  }
  if (String(listing.host_id) !== String(req.user._id)) {
    return res.status(403).json({ error: 'Not authorized to delete this listing' })
  }

  await Accommodation.findByIdAndDelete(id)
  res.status(200).json(listing)
}

module.exports = {
  getAccommodations,
  getAccommodation,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation
}
