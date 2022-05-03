module.exports = (sequelize, Sequelize) => {
  const PlaceType = sequelize.define('placeType', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  })
  return PlaceType
}
