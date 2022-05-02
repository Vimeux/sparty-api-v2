module.exports = (sequelize, Sequelize) => {
  const Features = sequelize.define('features', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  })
  return Features
}
