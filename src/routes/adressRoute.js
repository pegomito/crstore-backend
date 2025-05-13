import adressController from '../controllers/adressController.js';

export default (app) => {
  app.get('/adresses', adressController.get);
  app.get('/adresses/:id', adressController.get);
  app.post('/adresses', adressController.persist);
  app.patch('/adresses/:id', adressController.persist);
  app.delete('/adresses/:id', adressController.destroy);
}