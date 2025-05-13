import Payment from "../models/PaymentsModel.js";

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      const response = await Payment.findAll({
        order: [['id', 'desc']],
      });

      return res.status(200).send({
        message: 'Métodos de pagamento encontrados',
        data: response,
      });
    }

    const response = await Payment.findOne({
      where: {
        id: id,
      },
    });

    if (!response) {
      return res.status(404).send('Método de pagamento não encontrado');
    }

    return res.status(200).send({
      message: 'Método de pagamento encontrado',
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
    const response = await Payment.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      throw new Error('Método de pagamento não encontrado');
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
    const { name } = data;

    const response = await Payment.create({
      name,
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
        message: 'Método de pagamento criado com sucesso!',
        data: response,
      });
    }

    const response = await update(req.body, id);
    return res.status(201).send({
      message: 'Método de pagamento atualizado com sucesso!',
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
      return res.status(400).send('Informe o ID do método de pagamento');
    }

    const response = await Payment.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      return res.status(404).send('Método de pagamento não encontrado');
    }

    await response.destroy();

    return res.status(200).send({
      message: 'Método de pagamento excluído com sucesso',
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