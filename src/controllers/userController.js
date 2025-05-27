  import User from "../models/UsersModel.js";
  import bcrypt from "bcrypt";
  import jwt from "jsonwebtoken";
  import sendMail from "../utils/email.js";
  import { Op } from "sequelize";


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

  const create = async (corpo, res) => {
    try {
      const {
        name,
        cpf,
        username,
        phone,
        password,
        token,
        role,
        cart,
        email,
        recuperation
      } = corpo;

      const verficarEmail = await User.findOne({
        where: { email }
      });

      if (verficarEmail) {
        return res.status(400).send('email ja cadastrado');
      }

      const passwordHash = await bcrypt.hash(password, 10);

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

      return res.status(201).send({
        message: 'Usuário criado com sucesso!',
        data: response,
      });
    } catch (error) {
      return res.status(500).send({
        message: error.message,
      });
    }
  };
  const persist = async (req, res) => {
    try {
      const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

      if (!id) {
        return await create(req.body, res);
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

  const login = async (req, res) => {
    try {
      const{ 
        email, 
        password } = req.body;

        const user = await User.findOne({
          where: {
            email
          }
        });
        if (!user) {
          return res.status(400).send('email ou senha invalidos');
        }
        const comparacaoSenha = await bcrypt.compare(password, user.passwordHash);

        if (!comparacaoSenha) {
          return res.status(400).send('email ou senha invalidos');
        }
        if(comparacaoSenha){
          const token = jwt.sign({
            idUser: user.id, 
            nome: user.name,
            email: user.email,
            role: user.role

          }, process.env.TOKEN_KEY, {
            expiresIn: '8h'
          });

          return res.status(200).send({
            message: 'login realizado com sucesso',
            data: user,
            response: token
          });
        }

        
    }    catch (error) {
      return res.status(500).send({
        message: error.message
      });
    }
  }

  const getDataByToken = async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({
          message: 'token não informado'
        });
      }

      const token = authHeader.split(' ')[1];
      const user = jwt.verify(token, process.env.TOKEN_KEY);

      if (!user) {
        return res.status(401).send({
          message: 'token inválido'
        });
      }
      
      const userId = user.idUser;

      const userData = await User.findOne({
        where: {
          id: userId
        },
      });
      
      if (!userData) {
        return res.status(404).send({
          message: 'usuario não encontrado'
        })
      }

      return res.status(200).send({
        message: 'usuario encontrado',
        response: userData,
      });

    } catch (error) {
      return res.status(500).send({
        message: error.message,
        data: null
      });
    }
  }

  const enviarEmailRecover = async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(404).send({
          message: "Usuário não encontrado",
        });
      }

    
      const token = jwt.sign(
        { email: user.email },
        process.env.TOKEN_KEY,
        { expiresIn: "30m" } )

      
      user.recuperation = token; 
      user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); 
      await user.save();

      
      await sendMail(
        user.email,
        user.name || "Usuário",
        `Seu código para redefinição de senha é: ${token}. Ele expira em 30 minutos.`,
        "Redefinição de Senha"
      );

      return res.status(200).send({
        message: "Código enviado para o e-mail",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        message: "Erro ao enviar o código de redefinição de senha",
      });
    }
  };

  const trocarSenha = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).send({
        message: "Token e nova senha são obrigatórios",
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.TOKEN_KEY);

      if (!decoded || !decoded.email) {
        return res.status(400).send({
          message: "Token inválido",
        });
      }

      const user = await User.findOne({
        where: {
          email: decoded.email,
          recuperation: token, 
          passwordResetExpires: { [Op.gt]: new Date() }, 
        },
      });

      if (!user) {
        return res.status(400).send({
          message: "Token inválido ou expirado",
        });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.passwordHash = hashedPassword;
      user.recuperation = null; 
      user.passwordResetExpires = null;
      await user.save();

      return res.status(200).send({
        message: "Senha alterada com sucesso!",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).send({
          message: "Token expirado",
        });
      }
      if (error.name === "JsonWebTokenError") {
        return res.status(400).send({
          message: "Token inválido",
        });
      }
      console.error(error);
      return res.status(500).send({
        message: "Erro ao redefinir senha",
      });
    }
  };

  // const trocarSenha = async (req, res) => {
  //   const { code, newPassword } = req.body;

  //   if (!code || !newPassword) {
  //     return res.status(400).send({ message: "código e nova senha são obrigatórios" });
  //   }

  //   try {
  //     const decoded = jwt.verify(code, process.env.TOKEN_KEY);

  //     if (!decoded || !decoded.email) {
  //       return res.status(400).send({ message: "código inválido" });
  //     }

  //     const user = await User.findOne({ where: { email: decoded.email } });

  //     if (!user) {
  //       return res.status(404).send({ message: "Usuário não encontrado" });
  //     }

  //     const hashedPassword = await bcrypt.hash(newPassword, 10);
  //     user.passwordHash = hashedPassword;

  //     await user.save();

  //     if (!user.email) {
  //       return res.status(400).send({ message: "E-mail do usuário não encontrado" });
  //     }

  //     console.log("E-mail do usuário:", user.email); 

  //     await sendMail(
  //       user.email, 
  //       user.nome || "Usuário", 
  //       "Sua senha foi alterada com sucesso. Se você não realizou essa alteração, entre em contato conosco imediatamente.", 
  //       "Senha alterada com sucesso" 
  //     );

  //     return res.status(200).send({ message: "Senha alterada com sucesso!" });
  //   } catch (error) {
  //     if (error.name === "TokenExpiredError") {
  //       return res.status(400).send({ message: "código expirado" });
  //     }
  //     if (error.name === "JsonWebTokenError") {
  //       return res.status(400).send({ message: "código inválido" });
  //     }
  //     console.error(error);
  //     return res.status(500).send({ message: "Erro ao redefinir senha" });
  //   }
  // };


  export default {
    get,
    persist,
    destroy,
    login,
    getDataByToken,
    trocarSenha,
    enviarEmailRecover
  };