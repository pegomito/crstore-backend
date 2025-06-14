import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
// import { token } from "morgan";

const Category = sequelize.define(
  'categories',
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
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Category;