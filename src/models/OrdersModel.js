import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
// import { token } from "morgan";
import User from "./UsersModel.js";
import Adress from "./AdressModel.js";
import Payment from "./PaymentsModel.js";
import Coupon from "./CouponsModel.js";

const Order = sequelize.define(
  'orders',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,  
    },
    status: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    total: {
      type: DataTypes.NUMERIC(15, 2),
      allowNull: true,
    },
    totalDiscount: {
      field: 'total_discount',
      type: DataTypes.NUMERIC(15, 2),
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

Order.belongsTo(User, {
  as: 'costumer',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
      name:'idUserCostumer',
      allowNull: false,
      field: 'id_user_costumer'
  }
});

Order.belongsTo(User, {
  as: 'delivery',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
      name:'idUserDelivery',
      allowNull: false,
      field: 'id_user_delivery' 
  }
});

Order.belongsTo(Adress, {
  as: 'adress',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
      name:'idAdress',
      allowNull: false,
      field: 'id_adress' 
  }
});

Order.belongsTo(Payment, {
  as: 'payment',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
      name:'idPayment',
      allowNull: false,
      field: 'id_payment' 
  }
});

Order.belongsTo(Coupon, {
  as: 'coupon',
  onUpdate: 'NO ACTION',
  onDelete: 'NO ACTION',
  foreignKey: {
      name:'idCoupon',
      allowNull: false,
      field: 'id_coupon' 
  }
});

export default Order;