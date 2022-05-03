module.exports = (sequelize, Sequelize) => {
  const Product = sequelize.define('products', {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true
    },
    name: {
      type: Sequelize.STRING
    }
  })
  return Product
}
