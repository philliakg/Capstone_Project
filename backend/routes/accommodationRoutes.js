const express = require('express')
const multer = require('multer')
const path = require('path')
const {
  getAccommodations,
  getAccommodation,
  createAccommodation,
  updateAccommodation,
  deleteAccommodation
} = require('../controllers/accommodationController')
const { requireAuth, requireHost } = require('../middleware/requireAuth')

const router = express.Router()

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'))
  },
  filename: function (req, file, cb) {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    cb(null, unique + path.extname(file.originalname))
  }
})

const upload = multer({ storage })

router.get('/', getAccommodations)
router.get('/:id', getAccommodation)
router.post('/', requireAuth, requireHost, upload.array('images', 8), createAccommodation)
router.patch('/:id', requireAuth, requireHost, upload.array('images', 8), updateAccommodation)
router.delete('/:id', requireAuth, requireHost, deleteAccommodation)

module.exports = router
