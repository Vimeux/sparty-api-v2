module.exports = (sequelize, Sequelize) => {
  const PartyUser = sequelize.define('partyUser', {
    budgetParticiaption: {
      type: Sequelize.INTEGER,
      allowNull: false
    }
  }, { timestamps: false })
  return PartyUser
}
