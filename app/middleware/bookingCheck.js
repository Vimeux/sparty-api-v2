const db = require('../models')
const Place = db.place

const checkBookingExisted = async (req, res, next) => {
  const { placeId, checkInDate, checkOutDate } = req.body

  if (!placeId || !checkInDate || !checkOutDate) return res.status(400).send({ message: 'Please fill all the required fields.' })

  try {
    // Get all bookings for a place for a user
    const place = await Place.findOne({
      where: {
        id: placeId
      }
    })

    console.log(place)

    // await places.forEach(place => {
    //   const booking = place.getUsers()
    //   console.log(booking)
    // })
    const booking = await place.getUsers()

    await Promise.all(booking.map(async booking => {
      console.log(booking)
    }))

    // await places.map(place => {
    //   const booking = place.getUsers()
    //   console.log(booking)
    //   return booking
    // })

    // next()
    res.status(200).send(booking)
  } catch (error) {
    res.status(500).send({ message: error.message })
  }
}

module.exports = {
  checkBookingExisted
}
