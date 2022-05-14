const { extractIdFromRequestAuthHeader } = require('../helpers/tokenHelper')
const db = require('../models')
const Place = db.place
const User = db.user
const Booking = db.booking

/**
 * Create a booking
 * @param {*} req CheckInDate, CheckOutDate, PlaceId and UserId
 * @param {*} res addedBooking
 * @returns {object} addedBooking
 */
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

/**
 * get all booking for a user
 * @param {*} req userId, id of the booking
 * @param {*} res user or error
 * @returns {object} user with bookings
 */
exports.getBookingByUser = async (req, res) => {
  const userId = extractIdFromRequestAuthHeader(req)
  // const id = req.query

  // if (!id) return res.status(400).send({ message: 'Please provide a booking id.' })

  try {
    const user = await User.findOne({
      where: {
        id: userId
      },
      include: [
        {
          model: Place
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

/**
 * Get all bookings for specific place of a user or all bookings for all places of a user
 * @param {*} req userId and placeId
 * @param {*} res bookings, place
 * @returns {object} bookings, place
 */
exports.getBookingByPlace = async (req, res) => {
  const userId = extractIdFromRequestAuthHeader(req)
  const id = req.query.id

  try {
    if (id) {
      // Get booking for a specific place
      const place = await Place.findOne({
        where: {
          id
        }
      })
      if (!place) return res.status(400).send({ message: 'Place not found.' })
      // if (place.userId !== userId) return res.status(400).send({ message: 'You are not authorized to view this booking.' })

      const bookings = await place.getUsers()

      res.status(200).send({
        message: 'Booking was found successfully!',
        place,
        bookings
      })
    } else {
      // Get all bookings for a place for a user
      const places = await Place.findAll({
        where: {
          userId
        },
        include: [
          {
            model: User,
            as: 'users'
          }
        ]
      })
      console.log(places.userId, userId)
      if (!places) return res.status(400).send({ message: 'Places not found.' })

      res.status(200).send({
        message: 'Bookings were found successfully!',
        places
      })
    }
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

/**
 * Update a booking
 * @param {Object} req CheckInDate, CheckOutDate, PlaceId and UserId
 * @param {*} res bookingUpdated
 * @returns {object} bookingUpdated
 */
exports.updateBooking = async (req, res) => {
  const userId = extractIdFromRequestAuthHeader(req)
  const { bookingId, checkInDate, checkOutDate } = req.body

  try {
    const booking = await Booking.findOne({
      where: {
        bookingId
      }
    })

    if (booking.userId !== userId) return res.status(400).send({ message: 'You are not authorized to update this booking.' })

    const bookingUpdated = await booking.update({
      checkInDate,
      checkOutDate
    })

    res.status(200).send({
      message: 'Booking was updated successfully!',
      bookingUpdated
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

/**
 * Delete a booking
 * @param {*} req id of the booking and the userId
 * @param {*} res bookingDeleted
 * @returns {object} bookingDeleted
 */
exports.deleteBooking = async (req, res) => {
  const userId = extractIdFromRequestAuthHeader(req)
  const bookingId = req.query.id

  try {
    const booking = await Booking.findOne({
      where: {
        bookingId
      }
    })

    if (!booking) return res.status(400).send({ message: 'Booking not found.' })
    if (booking.userId !== userId) return res.status(400).send({ message: 'You are not authorized to delete this booking.' })

    const bookingDeleted = await booking.destroy()

    res.status(200).send({
      message: 'Booking was deleted successfully!',
      bookingDeleted
    })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}
