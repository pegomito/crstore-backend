import Category from "../models/CategoriesModel.js";

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      const response = await Category.findAll({
        order: [['id', 'desc']],
      });

      return res.status(200).send({
        message: 'Categorias encontradas',
        data: response,
      });
    }

    const response = await Category.findOne({
      where: {
        id: id,
      },
    });

    if (!response) {
      return res.status(404).send('Categoria não encontrada');
    }

    return res.status(200).send({
      message: 'Categoria encontrada',
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
    const response = await Category.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      throw new Error('Categoria não encontrada');
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
      name
     } = corpo;

    const response = await Category.create({
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
        message: 'Categoria criada com sucesso!',
        data: response,
      });
    }

    const response = await update(req.body, id);
    return res.status(201).send({
      message: 'Categoria atualizada com sucesso!',
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
      return res.status(400).send('Informe o ID da categoria');
    }

    const response = await Category.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      return res.status(404).send('Categoria não encontrada');
    }

    await response.destroy();

    return res.status(200).send({
      message: 'Categoria excluída com sucesso',
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