const express = require('express')
const {
  createReservation,
  getUserReservations,
  getHostReservations,
  deleteReservation
} = require('../controllers/reservationController')
const { requireAuth, requireHost } = require('../middleware/requireAuth')

const router = express.Router()

router.post('/', requireAuth, createReservation)
router.get('/user', requireAuth, getUserReservations)
router.get('/host', requireAuth, requireHost, getHostReservations)
router.delete('/:id', requireAuth, deleteReservation)

module.exports = router
