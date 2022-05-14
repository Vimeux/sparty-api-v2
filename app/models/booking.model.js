module.exports = (sequelize, Sequelize) => {
  const Booking = sequelize.define('booking', {
    bookingId: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    checkInDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    checkOutDate: {
      type: Sequelize.DATE,
      allowNull: false
    },
    cancelDate: {
      type: Sequelize.DATE
    },
    bookingDate: {
      type: Sequelize.DATE
    }
  }, { timestamps: false })
  return Booking
}
