const config = require('../config/db.config.js')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
)

const db = {}
db.Sequelize = Sequelize
db.sequelize = sequelize
db.user = require('../models/user.model.js')(sequelize, Sequelize)
db.role = require('../models/role.model.js')(sequelize, Sequelize)
db.place = require('../models/place.model.js')(sequelize, Sequelize)
db.feature = require('../models/feature.model.js')(sequelize, Sequelize)
db.city = require('../models/city.model.js')(sequelize, Sequelize)
db.placeType = require('../models/placeType.model.js')(sequelize, Sequelize)

// relation between user and role
db.role.belongsToMany(db.user, {
  through: 'user_roles',
  foreignKey: 'roleId',
  otherKey: 'userId'
})

db.user.belongsToMany(db.role, {
  through: 'user_roles',
  foreignKey: 'userId',
  otherKey: 'roleId'
})

// relation user has many places and place has one user
db.user.hasMany(db.place)
db.place.belongsTo(db.user)

// relation between place and city
db.city.hasMany(db.place, {
  foreignKey: 'cityId',
  onDelete: 'NO ACTION'
})
db.place.belongsTo(db.city)

// relation between place and placeType
db.placeType.hasMany(db.place, {
  foreignKey: 'placeTypeId',
  onDelete: 'NO ACTION'
})
db.place.belongsTo(db.placeType)

// relation between place and feature
db.place.belongsToMany(db.feature, {
  through: 'place_features',
  foreignKey: 'placeId',
  otherKey: 'featureId'
})

db.feature.belongsToMany(db.place, {
  through: 'place_features',
  foreignKey: 'featureId',
  otherKey: 'placeId'
})

db.ROLES = ['user', 'admin', 'moderator']
module.exports = db
