const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  discountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    validate: {
      min: 0
    }
  },
  discountPercentage: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 100
    }
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  category: {
    type: DataTypes.ENUM('T-shirts', 'Shorts', 'Shirts', 'Hoodie', 'Jeans'),
    allowNull: false
  },
  sizes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  colors: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    }
  },
  numReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  dressStyle: {
    type: DataTypes.ENUM('Casual', 'Formal', 'Party', 'Gym'),
    defaultValue: 'Casual'
  }
}, {
  timestamps: true
});

module.exports = Product;