const Reservation = require('../models/Reservation')
const Accommodation = require('../models/Accommodation')
const mongoose = require('mongoose')

const createReservation = async (req, res) => {
  const {
    accommodation, checkIn, checkOut, guests, nights, price,
    weeklyDiscount, cleaningFee, serviceFee, occupancyTaxes, grandTotal
  } = req.body

  if (!accommodation || !checkIn || !checkOut || !guests || !nights || grandTotal === undefined) {
    return res.status(400).json({ error: 'Please fill in all required fields' })
  }

  try {
    const listing = await Accommodation.findById(accommodation)
    if (!listing) {
      return res.status(404).json({ error: 'No such accommodation' })
    }

    const reservation = await Reservation.create({
      user: req.user._id,
      accommodation,
      checkIn,
      checkOut,
      guests: Number(guests),
      nights: Number(nights),
      price: Number(price) || listing.price,
      weeklyDiscount: Number(weeklyDiscount) || 0,
      cleaningFee: Number(cleaningFee) || 0,
      serviceFee: Number(serviceFee) || 0,
      occupancyTaxes: Number(occupancyTaxes) || 0,
      grandTotal: Number(grandTotal)
    })

    const populated = await Reservation.findById(reservation._id)
      .populate('accommodation')
      .populate('user', 'username email')

    res.status(200).json(populated)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getUserReservations = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate('accommodation')
      .sort({ createdAt: -1 })
    res.status(200).json(reservations)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getHostReservations = async (req, res) => {
  try {
    const listings = await Accommodation.find({ host_id: req.user._id }).select('_id')
    const ids = listings.map((l) => l._id)
    const reservations = await Reservation.find({ accommodation: { $in: ids } })
      .populate('accommodation')
      .populate('user', 'username email')
      .sort({ createdAt: -1 })
    res.status(200).json(reservations)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}
const deleteReservation = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such reservation' })
  }

  try {
    const reservation = await Reservation.findById(id).populate('accommodation')
    if (!reservation) {
      return res.status(404).json({ error: 'No such reservation' })
    }

    const isOwner = String(reservation.user) === String(req.user._id)
    const isHost = reservation.accommodation && String(reservation.accommodation.host_id) === String(req.user._id)

    if (!isOwner && !isHost) {
      return res.status(403).json({ error: 'Not authorized to cancel this reservation' })
    }

    await Reservation.findByIdAndDelete(id)
    res.status(200).json(reservation)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

module.exports = {
  createReservation,
  getUserReservations,
  getHostReservations,
  deleteReservation
}
