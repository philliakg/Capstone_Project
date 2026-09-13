require('dotenv').config()

const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const bcrypt = require('bcrypt')

const accommodationRoutes = require('./routes/accommodationRoutes')
const reservationRoutes = require('./routes/reservationRoutes')
const userRoutes = require('./routes/userRoutes')
const User = require('./models/User')
const Accommodation = require('./models/Accommodation')

const app = express()

const IMAGE_REMAP = {
  '/images/figma-image-33.jpg': '/images/Big_Card.png',
  '/images/figma-image-11.png': '/images/RoomImage1.png',
  '/images/figma-image-14.png': '/images/RoomImage.png',
  '/images/figma-image-17.png': '/images/RoomImage2.png',
  '/images/figma-image-01.png': '/images/RoomImage3.png',
  '/images/figma-image-26.png': '/images/BlueDownArrow.png',
  '/images/figma-image-05.jpg': '/images/Apartment.jpg',
  '/images/figma-image-04.jpg': '/images/Apartment1.jpg',
  '/images/figma-image-06.jpg': '/images/Apartment2.jpg',
  '/images/figma-image-07.png': '/images/Image11.png',
  '/images/figma-image-12.jpg': '/images/Apartment3.jpg',
  '/images/figma-image-13.jpg': '/images/Apartment.jpg',
  '/images/figma-image-25.png': '/images/AvatarBase.png',
  '/images/figma-image-20.png': '/images/Avatar.png',
  '/images/figma-image-18.png': '/images/Avatar2.png',
  '/images/figma-image-21.png': '/images/Avatar3.png',
  '/images/figma-image-22.png': '/images/Avatar4.png',
  '/images/figma-image-23.png': '/images/Avatar5.png',
  '/images/figma-image-24.png': '/images/Avatar6.png',
  '/images/figma-image-10.png': '/images/Avatar7.png',
  '/images/figma-image-02.png': '/images/RoomImage1.png'
}

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))
app.use('/images', express.static(path.join(__dirname, 'uploads')))

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

app.use('/api/accommodations', accommodationRoutes)
app.use('/api/reservations', reservationRoutes)
app.use('/api/users', userRoutes)

const seedIfEmpty = async () => {
  const listingCount = await Accommodation.countDocuments()

  let jane

  const salt = await bcrypt.genSalt(10)
  const philliaHash = await bcrypt.hash('password123', salt)
  const kgaboHash = await bcrypt.hash('password321', salt)

  await User.updateOne(
    { email: 'phillia@gmail.com' },
    {
      $set: {
        email: 'phillia@gmail.com',
        password: philliaHash,
        username: 'Phillia Ngoetjana',
        role: 'user'
      }
    },
    { upsert: true }
  )

  await User.updateOne(
    { email: 'kgabo@gmail.com' },
    {
      $set: {
        email: 'kgabo@gmail.com',
        password: kgaboHash,
        username: 'Kgabo Lebuso',
        role: 'host'
      }
    },
    { upsert: true }
  )

  jane = await User.findOne({ email: 'kgabo@gmail.com' })
  console.log('synced starter users')

  if (listingCount === 0 && jane) {
    const listings = [
      {
        title: 'Modern Villa with Garden Deck',
        location: 'Cape Town',
        description: 'A stunning contemporary villa in Cape Town with floor-to-ceiling glass, a private deck and a mature garden. Perfect for families who want space, light and easy access to the Atlantic Seaboard.',
        bedrooms: 4,
        bathrooms: 3,
        guests: 8,
        type: 'Entire home',
        price: 1850,
        amenities: ['Wifi', 'Kitchen', 'Free parking', 'Pool', 'Air conditioning', 'Washer', 'TV', 'Patio'],
        images: ['/images/RoomImage1.png', '/images/Big_Card.png', '/images/Avatar4.png', '/images/Avatar6.png', '/images/BlueDownArrow.png'],
        weeklyDiscount: 12,
        cleaningFee: 350,
        serviceFee: 220,
        occupancyTaxes: 95,
        rating: 4.92,
        reviews: 128,
        enhancedCleaning: true,
        selfCheckIn: true
      },
      {
        title: 'Paris City Apartment',
        location: 'Paris',
        description: 'Stay in the heart of Paris with this stylish apartment near cafes, galleries and the Metro. Ideal for couples and weekend city breaks.',
        bedrooms: 2,
        bathrooms: 2,
        guests: 4,
        type: 'Apartment',
        price: 980,
        amenities: ['Wifi', 'Kitchen', 'Dedicated workspace', 'Air conditioning', 'TV', 'Gym access', 'Washer'],
        images: ['/images/Big_Card.png', '/images/RoomImage1.png', '/images/Avatar4.png', '/images/Avatar6.png', '/images/BlueDownArrow.png'],
        weeklyDiscount: 10,
        cleaningFee: 180,
        serviceFee: 120,
        occupancyTaxes: 55,
        rating: 4.81,
        reviews: 76,
        enhancedCleaning: true,
        selfCheckIn: true
      },
      {
        title: 'Tokyo Designer Loft',
        location: 'Tokyo',
        description: 'An open-plan loft in Tokyo with herringbone floors, a designer kitchen and plenty of natural light. Close to galleries and local dining. A creative base for exploring the city.',
        bedrooms: 1,
        bathrooms: 1,
        guests: 2,
        type: 'Entire home',
        price: 720,
        amenities: ['Wifi', 'Kitchen', 'Dedicated workspace', 'Washer', 'TV', 'Self check-in'],
        images: ['/images/Avatar4.png', '/images/RoomImage1.png', '/images/Avatar6.png', '/images/BlueDownArrow.png', '/images/Big_Card.png'],
        weeklyDiscount: 8,
        cleaningFee: 140,
        serviceFee: 90,
        occupancyTaxes: 40,
        rating: 4.74,
        reviews: 54,
        enhancedCleaning: true,
        selfCheckIn: true
      },
      {
        title: 'Thailand Beach Villa',
        location: 'Thailand',
        description: 'Wake up to golden light and easy beach access. This relaxed Thailand stay has an open living area, outdoor seating and everything you need for a coastal holiday.',
        bedrooms: 3,
        bathrooms: 2,
        guests: 6,
        type: 'Entire home',
        price: 890,
        amenities: ['Wifi', 'Kitchen', 'Free parking', 'Air conditioning', 'TV', 'Patio', 'Beach nearby'],
        images: ['/images/BlueDownArrow.png', '/images/RoomImage1.png', '/images/Avatar4.png', '/images/Big_Card.png', '/images/Avatar6.png'],
        weeklyDiscount: 15,
        cleaningFee: 200,
        serviceFee: 110,
        occupancyTaxes: 48,
        rating: 4.86,
        reviews: 91,
        enhancedCleaning: true,
        selfCheckIn: true
      },
      {
        title: 'New York City Studio',
        location: 'New York',
        description: 'A bright studio in a classic city building. Walk to cafes, galleries and the subway. Compact, well designed and perfect for a couple exploring New York.',
        bedrooms: 1,
        bathrooms: 1,
        guests: 2,
        type: 'Apartment',
        price: 1650,
        amenities: ['Wifi', 'Kitchen', 'Dedicated workspace', 'Air conditioning', 'Washer', 'TV', 'Self check-in'],
        images: ['/images/Avatar6.png', '/images/Avatar4.png', '/images/RoomImage1.png', '/images/Big_Card.png', '/images/BlueDownArrow.png'],
        weeklyDiscount: 10,
        cleaningFee: 280,
        serviceFee: 190,
        occupancyTaxes: 120,
        rating: 4.88,
        reviews: 203,
        enhancedCleaning: true,
        selfCheckIn: true
      },
      {
        title: 'Cape Town Scandi Living Room Home',
        location: 'Cape Town',
        description: 'A calm, light-filled home with a mustard armchair, herringbone floors and a dedicated dining space. Minutes from cafes in the City Bowl. Great for remote workers.',
        bedrooms: 2,
        bathrooms: 1,
        guests: 4,
        type: 'Entire home',
        price: 1100,
        amenities: ['Wifi', 'Kitchen', 'Dedicated workspace', 'Washer', 'TV', 'Free parking', 'Air conditioning'],
        images: ['/images/RoomImage1.png', '/images/Avatar4.png', '/images/Avatar6.png', '/images/Big_Card.png', '/images/BlueDownArrow.png'],
        weeklyDiscount: 11,
        cleaningFee: 210,
        serviceFee: 140,
        occupancyTaxes: 62,
        rating: 4.9,
        reviews: 67,
        enhancedCleaning: true,
        selfCheckIn: true
      },
      {
        title: 'Paris Luxury Suite',
        location: 'Paris',
        description: 'A polished suite for guests who want comfort close to Paris’s historic centre. High ceilings, a modern kitchenette and a quiet bedroom.',
        bedrooms: 1,
        bathrooms: 1,
        guests: 2,
        type: 'Private room',
        price: 640,
        amenities: ['Wifi', 'Kitchen', 'Air conditioning', 'TV', 'Dedicated workspace'],
        images: ['/images/RoomImage1.png', '/images/Big_Card.png', '/images/Avatar4.png', '/images/Avatar6.png', '/images/BlueDownArrow.png'],
        weeklyDiscount: 7,
        cleaningFee: 120,
        serviceFee: 80,
        occupancyTaxes: 35,
        rating: 4.7,
        reviews: 41,
        enhancedCleaning: true,
        selfCheckIn: false
      },
      {
        title: 'New York Garden Cottage',
        location: 'New York',
        description: 'A private garden cottage with its own entrance, outdoor dining and a leafy outlook. Peaceful and a short trip from downtown New York.',
        bedrooms: 2,
        bathrooms: 2,
        guests: 4,
        type: 'Guest suite',
        price: 780,
        amenities: ['Wifi', 'Kitchen', 'Free parking', 'Patio', 'Washer', 'TV', 'Self check-in'],
        images: ['/images/Big_Card.png', '/images/RoomImage1.png', '/images/Avatar4.png', '/images/Avatar6.png', '/images/BlueDownArrow.png'],
        weeklyDiscount: 9,
        cleaningFee: 160,
        serviceFee: 100,
        occupancyTaxes: 45,
        rating: 4.83,
        reviews: 58,
        enhancedCleaning: true,
        selfCheckIn: true
      }
    ]

    await Accommodation.insertMany(
      listings.map((l) => ({ ...l, host: jane.username, host_id: jane._id }))
    )
    console.log('seeded listings')
  }

  const seedFixes = [
    {
      from: ['Sandton City Apartment'],
      set: {
        title: 'Paris City Apartment',
        location: 'Paris',
        description: 'Stay in the heart of Paris with this stylish apartment near cafes, galleries and the Metro. Ideal for couples and weekend city breaks.'
      }
    },
    {
      from: ['Johannesburg Designer Loft'],
      set: {
        title: 'Tokyo Designer Loft',
        location: 'Tokyo',
        description: 'An open-plan loft in Tokyo with herringbone floors, a designer kitchen and plenty of natural light. Close to galleries and local dining. A creative base for exploring the city.'
      }
    },
    {
      from: ['Durban Beach Getaway'],
      set: {
        title: 'Thailand Beach Villa',
        location: 'Thailand',
        description: 'Wake up to golden light and easy beach access. This relaxed Thailand stay has an open living area, outdoor seating and everything you need for a coastal holiday.'
      }
    },
    {
      from: ['Sandton Luxury Suite'],
      set: {
        title: 'Paris Luxury Suite',
        location: 'Paris',
        description: 'A polished suite for guests who want comfort close to Paris’s historic centre. High ceilings, a modern kitchenette and a quiet bedroom.'
      }
    },
    {
      from: ['Johannesburg Garden Cottage'],
      set: {
        title: 'New York Garden Cottage',
        location: 'New York',
        description: 'A private garden cottage with its own entrance, outdoor dining and a leafy outlook. Peaceful and a short trip from downtown New York.'
      }
    }
  ]

  for (const fix of seedFixes) {
    await Accommodation.updateMany({ title: { $in: fix.from } }, { $set: fix.set })
  }

  // Normalize legacy seeded image paths in existing records.
  const existing = await Accommodation.find({}, { images: 1 })
  for (const doc of existing) {
    if (!Array.isArray(doc.images) || doc.images.length === 0) continue
    const nextImages = doc.images.map((img) => IMAGE_REMAP[img] || img)
    const changed = nextImages.some((img, idx) => img !== doc.images[idx])
    if (!changed) continue
    doc.images = nextImages
    await doc.save()
  }
}

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('connected to db')
    await seedIfEmpty()
    app.listen(process.env.PORT, () => {
      console.log('listening on port', process.env.PORT)
    })
  })
  .catch((error) => {
    console.log(error)
  })
