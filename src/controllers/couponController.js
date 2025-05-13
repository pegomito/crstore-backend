import Coupon from "../models/CouponsModel.js";

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      const response = await Coupon.findAll({
        order: [['id', 'desc']],
      });

      return res.status(200).send({
        message: 'Cupons encontrados',
        data: response,
      });
    }

    const response = await Coupon.findOne({
      where: {
        id: id,
      },
    });

    if (!response) {
      return res.status(404).send('Cupom não encontrado');
    }

    return res.status(200).send({
      message: 'Cupom encontrado',
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
    const response = await Coupon.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      throw new Error('Cupom não encontrado');
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
    const { code, type, value, uses } = data;

    const response = await Coupon.create({
      code,
      type,
      value,
      uses,
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
        message: 'Cupom criado com sucesso!',
        data: response,
      });
    }

    const response = await update(req.body, id);
    return res.status(201).send({
      message: 'Cupom atualizado com sucesso!',
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
      return res.status(400).send('Informe o ID do cupom');
    }

    const response = await Coupon.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      return res.status(404).send('Cupom não encontrado');
    }

    await response.destroy();

    return res.status(200).send({
      message: 'Cupom excluído com sucesso',
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