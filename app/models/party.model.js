module.exports = (sequelize, Sequelize) => {
  const Party = sequelize.define('partys', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    budget: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    invitationCode: {
      type: Sequelize.STRING,
      allowNull: false
    },
    date: {
      type: Sequelize.DATE,
      allowNull: false
    },
    maxPersonn: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  })
  return Party
}
