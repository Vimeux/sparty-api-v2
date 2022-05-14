const momentTimezone = require('moment-timezone')
const db = require('../models')
const Op = db.Sequelize.Op
const Booking = db.booking

// Function to receive booking data (CEST) and convert to JS Date object
// Data expected in [year, month, date, hours, seconds] format
const dateUTC = (dataArray) => {
  // Ensure date data is saved in CEST and then converted to a Date object in UTC
  return momentTimezone(dataArray).tz('Europe/Paris').toDate()
}

const checkBookingExisted = async (req, res, next) => {
  const { bookingId, placeId, checkInDate, checkOutDate } = req.body

  if (!checkInDate || !checkOutDate) return res.status(400).send({ message: 'Please fill all the required fields.' })

  // convert date to Date object in UTC
  const bookingStartDate = dateUTC(checkInDate)
  const bookingEndDate = dateUTC(checkOutDate)

  // convert bookking date object into a number value
  const newBookingStart = bookingStartDate.getTime()
  const newBookingEnd = bookingEndDate.getTime()

  // Get actual Date object for the current date
  const actualDate = new Date().getTime()

  try {
    // get Bookings where placeId or bookingId if provided
    const bookings = await Booking.findAll({
      where: {
        // if bookingId is provided, get only the booking with the provided id
        [Op.or]: {
          bookingId: {
            [Op.ne]: bookingId
          },
          placeId: {
            [Op.eq]: placeId
          }
        }
      }
    })

    // Ensure the new booking is valid (i.e not in the past)
    if (newBookingStart > newBookingEnd || newBookingStart < actualDate) return res.status(400).send({ message: 'Invalid Date' })

    let bookingClash = false

    await Promise.all(bookings.map(async booking => {
      // console.log({ mes_bookings: booking.booking })

      // convert booking date object into a number value
      const existingBookingStart = booking.checkInDate.getTime()
      const existingBookingEnd = booking.checkOutDate.getTime()

      // Check wether the new booking times overlap with any of the exisitng bookings
      if (
        (newBookingStart >= existingBookingStart && newBookingStart < existingBookingEnd) ||
        (existingBookingStart >= newBookingStart && existingBookingStart < newBookingEnd)
      ) {
        bookingClash = true
        return bookingClash
      }
    }))

    if (bookingClash) return res.status(400).send({ message: 'Existing Booking on this Dates' })

    next()
    // return res.status(200).send({
    //   bookings
    // })
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

module.exports = {
  checkBookingExisted
}
