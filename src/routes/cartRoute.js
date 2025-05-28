import loginMiddleware from '../middlewares/loginMiddleware.js';
import * as cartController from '../controllers/cartController.js';

export default (app) => {
  app.get('/cart', loginMiddleware, cartController.getCart);
  app.post('/cart', loginMiddleware, cartController.updateCart);
  app.delete('/cart', loginMiddleware, cartController.clearCart);
};