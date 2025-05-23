import jwt from 'jsonwebtoken';

const loginMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).send({ message: 'Token não informado' });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).send({ message: 'Token inválido' });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    if (!decoded) {
      return res.status(401).send({ message: 'Token inválido' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).send({ message: 'Token expirado' });
    }
    return res.status(500).send({ message: 'Erro ao verificar o token' });
  }
};

export default loginMiddleware;