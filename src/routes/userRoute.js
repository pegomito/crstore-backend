import userController from "../controllers/userController.js";
import loginMiddleware from '../middlewares/loginMiddleware.js';
// import roleMiddleware from "../middlewares/roleMiddleware.js";

export default (app) => {
  app.get('/users', userController.get);
  app.get('/users/token',loginMiddleware, userController.getDataByToken);
  app.get('/users/:id', userController.get);
  app.post('/users', userController.persist);
  app.patch('/users/:id', userController.persist);
  app.delete('/users/:id', userController.destroy);
  app.post('/users/login', userController.login);
  app.post('/users/email', userController.enviarEmailRecover);
  app.post('/users/recuperar-senha', userController.trocarSenha);
}
// roleMiddleware GET('admin') 
// ,