import userController from "../controllers/userController.js";
import loginMiddleware from '../middlewares/loginMiddleware.js';

export default (app) => {
  app.get('/users', loginMiddleware,userController.get);
  app.get('/users/:id', loginMiddleware,userController.get);
  app.post('/users', userController.persist);
  app.patch('/users/:id', loginMiddleware,userController.persist);
  app.delete('/users/:id', loginMiddleware,userController.destroy);
  app.post('/users/login', userController.login);
  app.get('/users/token', loginMiddleware,userController.getDataByToken);
  app.post('/users/email', userController.enviarEmailRecover);
  app.post('/users/recuperar-senha', userController.trocarSenha);
}