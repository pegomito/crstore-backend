import User from "../models/UsersModel.js";

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      const response = await User.findAll({
        order: [['id', 'desc']],
      });

      return res.status(200).send({
        message: 'Usuários encontrados',
        data: response,
      });
    }

    const response = await User.findOne({
      where: {
        id: id,
      },
    });

    if (!response) {
      return res.status(404).send('Usuário não encontrado');
    }

    return res.status(200).send({
      message: 'Usuário encontrado',
      data: response,
    });
  } catch (error) {
    return res.status(500).send({
      message: error.message,
    });
  }
};

const update = async (corpo, id) => {
  try {
    const response = await User.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      throw new Error('Usuário não encontrado');
    }

    Object.keys(corpo).forEach((item) => (response[item] = corpo[item]));
    await response.save();

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

const create = async (corpo) => {
  try {
    const {
      name,
      cpf,
      username,
      phone,
      passwordHash,
      token,
      role,
      cart,
      email,
      recuperation
    } = corpo;

    const response = await User.create({
      name,
      cpf,
      username,
      phone,
      passwordHash,
      token,
      role,
      cart,
      email,
      recuperation
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
        message: 'Usuário criado com sucesso!',
        data: response,
      });
    }

    const response = await update(req.body, id);
    return res.status(201).send({
      message: 'Usuário atualizado com sucesso!',
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
      return res.status(400).send('Informe o ID do usuário');
    }

    const response = await User.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      return res.status(404).send('Usuário não encontrado');
    }

    await response.destroy();

    return res.status(200).send({
      message: 'Usuário excluído com sucesso',
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