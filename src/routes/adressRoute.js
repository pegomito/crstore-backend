import adressController from '../controllers/adressController.js';
import loginMiddleware from '../middlewares/loginMiddleware.js';

export default (app) => {
  app.get('/adresses', loginMiddleware, adressController.get);
  app.get('/adresses/:id', adressController.get);
  app.post('/adresses',loginMiddleware, adressController.persist);
  app.patch('/adresses/:id',loginMiddleware, adressController.persist);
  app.delete('/adresses/:id',loginMiddleware, adressController.destroy);
}