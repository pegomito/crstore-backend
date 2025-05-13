import OrderProduct from "../models/Orders_ProductsModel.js";
import Order from "../models/OrdersModel.js";
import Product from "../models/ProductsModel.js";

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      const response = await OrderProduct.findAll({
        order: [['id', 'desc']],
        include: [
          { model: Order, as: 'order' },
          { model: Product, as: 'product' },
        ],
      });

      return res.status(200).send({
        message: 'Pedidos e produtos encontrados',
        data: response,
      });
    }

    const response = await OrderProduct.findOne({
      where: {
        id: id,
      },
      include: [
        { model: Order, as: 'order' },
        { model: Product, as: 'product' },
      ],
    });

    if (!response) {
      return res.status(404).send('Pedido ou produto não encontrado');
    }

    return res.status(200).send({
      message: 'Pedido e produto encontrado',
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
    const response = await OrderProduct.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      throw new Error('Pedido ou produto não encontrado');
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
    const { idOrder, idProduct, priceProducts, quantity } = data;

    const response = await OrderProduct.create({
      idOrder,
      idProduct,
      priceProducts,
      quantity,
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
        message: 'Pedido e produto criado com sucesso!',
        data: response,
      });
    }

    const response = await update(req.body, id);
    return res.status(201).send({
      message: 'Pedido e produto atualizado com sucesso!',
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
      return res.status(400).send('Informe o ID do pedido ou produto');
    }

    const response = await OrderProduct.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      return res.status(404).send('Pedido ou produto não encontrado');
    }

    await response.destroy();

    return res.status(200).send({
      message: 'Pedido e produto excluído com sucesso',
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