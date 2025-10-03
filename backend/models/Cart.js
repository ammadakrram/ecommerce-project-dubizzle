const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discountPercentage: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  deliveryFee: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 15
  },
  total: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  }
}, {
  timestamps: true,
  hooks: {
    beforeSave: async (cart) => {
      // Calculate totals
      cart.discount = (cart.subtotal * cart.discountPercentage) / 100;
      cart.total = cart.subtotal - cart.discount + cart.deliveryFee;
    }
  }
});

module.exports = Cart;