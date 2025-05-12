import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Order from "./OrdersModel.js";
import Product from "./ProductsModel.js";
// import { token } from "morgan";


const OrderProduct = sequelize.define(
  'orders_products',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,  
    },
    priceProducts: {
      field: 'price_products',
      type: DataTypes.NUMERIC(15, 2),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER(255),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

OrderProduct.belongsTo(Order, {
  as: 'order',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
      name:'idOrder',
      allowNull: false,
      field: 'id_order'
  }
});

OrderProduct.belongsTo(Product, {
  as: 'product',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
      name:'idProduct',
      allowNull: false,
      field: 'id_product'
  }
}); 

export default OrderProduct;