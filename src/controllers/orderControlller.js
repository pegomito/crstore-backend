import Order from "../models/OrdersModel.js";
import User from "../models/UsersModel.js";
import Adress from "../models/AdressModel.js";
import Payment from "../models/PaymentsModel.js";
import Coupon from "../models/CouponsModel.js";

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      const response = await Order.findAll({
        order: [['id', 'desc']],
        include: [
          { model: User, as: 'costumer' },
          { model: User, as: 'delivery' },
          { model: Adress, as: 'adress' },
          { model: Payment, as: 'payment' },
          { model: Coupon, as: 'coupon' },
        ],
      });

      return res.status(200).send({
        message: 'Pedidos encontrados',
        data: response,
      });
    }

    const response = await Order.findOne({
      where: {
        id: id,
      },
      include: [
        { model: User, as: 'costumer' },
        { model: User, as: 'delivery' },
        { model: Adress, as: 'adress' },
        { model: Payment, as: 'payment' },
        { model: Coupon, as: 'coupon' },
      ],
    });

    if (!response) {
      return res.status(404).send('Pedido não encontrado');
    }

    return res.status(200).send({
      message: 'Pedido encontrado',
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const update = async (data, id) => {
  try {
    const response = await Order.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      throw new Error('Pedido não encontrado');
    }

    Object.keys(data).forEach((key) => (response[key] = data[key]));
    await response.save();

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (data) => {
  try {
    const { status, total, totalDiscount, idUserCostumer, idUserDelivery, idAdress, idPayment, idCoupon } = data;

    const response = await Order.create({
      status,
      total,
      totalDiscount,
      idUserCostumer,
      idUserDelivery,
      idAdress,
      idPayment,
      idCoupon,
    });

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const persist = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    if (!id) {
      const response = await create(req.body);
      return res.status(201).send({
        message: 'Pedido criado com sucesso!',
        data: response,
      });
    }

    const response = await update(req.body, id);
    return res.status(201).send({
      message: 'Pedido atualizado com sucesso!',
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const destroy = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      return res.status(400).send('Informe o ID do pedido');
    }

    const response = await Order.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      return res.status(404).send('Pedido não encontrado');
    }

    await response.destroy();

    return res.status(200).send({
      message: 'Pedido excluído com sucesso',
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

export default {
  get,
  persist,
  destroy,
};