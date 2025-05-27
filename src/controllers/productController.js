import Product from "../models/ProductsModel.js";
import Category from "../models/CategoriesModel.js";
import uploadFile from "../utils/uploadFile.js";

const get = async (req, res) => {
  try {
    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
    if (!id) {
      const response = await Product.findAll({
        order: [['id', 'desc']],
        include: [
          { model: Category, as: 'category' },
        ],
      });

      return res.status(200).send({
        message: 'Produtos encontrados',
        data: response,
      });
    }

    const response = await Product.findOne({
      where: {
        id: id,
      },
      include: [
        { model: Category, as: 'category' },
      ],
    });

    if (!response) {
      return res.status(404).send('Produto não encontrado');
    }

    return res.status(200).send({
      message: 'Produto encontrado',
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
    const response = await Product.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      throw new Error('Produto não encontrado');
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
    const { name, price, image, description, district, numberForget, idCategory } = data;

    const response = await Product.create({
      name,
      price,
      image,
      description,
      district,
      numberForget,
      idCategory,
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
      let imageUrl = null;
      
      if (req.files && req.files.image) {
        const uploadResult = await uploadFile(req.files.image, {
          tipo: 'imagem',
          tabela: 'products',
          id: Date.now()
        });
        console.log('uploadResult:', uploadResult);
        if (uploadResult.type === 'success') {
          imageUrl = uploadResult.uploadPath.split('public').pop().replace(/\\/g, '/');
          console.log('imageUrl:', imageUrl);
        }
      } else if (req.body.image) {
        imageUrl = req.body.image;
      }

      const response = await Product.create({
        ...req.body,
        image: imageUrl
      });
      return res.status(201).send({
        message: 'Produto criado com sucesso!',
        data: response,
      });
    }

    const response = await update(req.body, id);
    return res.status(201).send({
      message: 'Produto atualizado com sucesso!',
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
      return res.status(400).send('Informe o ID do produto');
    }

    const response = await Product.findOne({
      where: {
        id,
      },
    });

    if (!response) {
      return res.status(404).send('Produto não encontrado');
    }

    await response.destroy();

    return res.status(200).send({
      message: 'Produto excluído com sucesso',
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