import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Category from "./CategoriesModel.js";
// import { token } from "morgan";

const Product = sequelize.define(
  'products',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,  
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    price: {
      type: DataTypes.NUMERIC(15, 2),
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING(2000),
      allowNull: true,
    },
    description: {
      type: DataTypes.STRING(300),
      allowNull: true,   
    },
    district: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    numberForget: {
      field: 'number_forget',
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
  
);
Product.belongsTo(Category, {
  as: 'category',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
      name:'idCategory',
      allowNull: false,
      field: 'id_category'
  }
});

export default Product;