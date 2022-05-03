module.exports = (sequelize, Sequelize) => {
  const City = sequelize.define('cities', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  })
  return City
}
