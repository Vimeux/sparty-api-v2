const { extractIdFromRequestAuthHeader } = require('../helpers/tokenHelper')
const db = require('../models')
const Place = db.place
const User = db.user

exports.createBooking = async (req, res) => {
  // Save Booking to data base
  const id = extractIdFromRequestAuthHeader(req)
  const { placeId, checkInDate, checkOutDate } = req.body

  if (!placeId || !checkInDate || !checkOutDate) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    const place = await Place.findOne({
      where: {
        id: placeId
      }
    })
    if (!place) return res.status(400).send({ message: 'Place not found.' })

    const user = await User.findOne({
      where: {
        id
      }
    })
    if (!user) return res.status(400).send({ message: 'User not found.' })

    const addedBooking = await place.addUser(user, { through: { checkInDate, checkOutDate } })

    res.status(201).send({
      message: 'Booking was created successfully!',
      booking: addedBooking
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.getBookingByUser = async (req, res) => {
  const userId = extractIdFromRequestAuthHeader(req)
  const id = req.query.id

  if (!id) return res.status(400).send({ message: 'Please provide a booking id.' })

  try {
    const user = await User.findOne({
      where: {
        id: userId
      },
      include: [
        {
          model: Place,
          through: {
            where: {
              bookingId: id
            }
          }
        }
      ]
    })
    if (!user) return res.status(400).send({ message: 'User not found.' })

    res.status(200).send({
      message: 'Booking was found successfully!',
      user
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

exports.getBookingByPlace = async (req, res) => {
  const userId = extractIdFromRequestAuthHeader(req)
  const id = req.query.id

  try {
    if (id) {
      const place = await Place.findOne({
        where: {
          id
        }
      })
      if (!place) return res.status(400).send({ message: 'Place not found.' })
      if (place.userId !== userId) return res.status(400).send({ message: 'You are not authorized to view this booking.' })

      const bookings = await place.getUsers()

      res.status(200).send({
        message: 'Booking was found successfully!',
        place,
        bookings
      })
    } else {
      const places = await Place.findAll({
        where: {
          userId
        }
      })
      console.log(places.userId, userId)
      if (!places) return res.status(400).send({ message: 'Places not found.' })
      if (places.userId !== userId) return res.status(400).send({ message: 'You are not authorized to view this booking.' })

      const bookings = await places.getUsers()

      res.status(200).send({
        message: 'Bookings were found successfully!',
        places,
        bookings
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
