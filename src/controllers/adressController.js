  import Adress from "../models/AdressModel.js";

  const get = async (req, res) => {
    try {
      const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;
      if (!id) {
        const response = await Adress.findAll({
          order: [['id', 'desc']],
        });

        return res.status(200).send({
          message: 'Endereços encontrados',
          data: response,
        });
      }

      const response = await Adress.findOne({
        where: {
          id: id,
        },
      });

      if (!response) {
        return res.status(404).send('Endereço não encontrado');
      }

      return res.status(200).send({
        message: 'Endereço encontrado',
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
      const response = await Adress.findOne({
        where: {
          id,
        },
      });

      if (!response) {
        throw new Error('Endereço não encontrado');
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
        zipCode,
        state,
        city,
        street,
        district,
        numberForget
      } = corpo;

      const response = await Adress.create({
        zipCode,
        state,
        city,
        street,
        district,
        numberForget
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
          message: 'Endereço criado com sucesso!',
          data: response,
        });
      }

      const response = await update(req.body, id);
      return res.status(201).send({
        message: 'Endereço atualizado com sucesso!',
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
        return res.status(400).send('Informe o ID do endereço');
      }

      const response = await Adress.findOne({
        where: {
          id,
        },
      });

      if (!response) {
        return res.status(404).send('Endereço não encontrado');
      }

      await response.destroy();

      return res.status(200).send({
        message: 'Endereço excluído com sucesso',
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