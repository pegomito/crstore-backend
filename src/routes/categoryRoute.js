import categoryController from '../controllers/categoryController.js';

export default (app) => {
  app.get('/categories', categoryController.get);
  app.get('/categories/:id', categoryController.get);
  app.post('/categories', categoryController.persist);
  app.patch('/categories/:id', categoryController.persist);
  app.delete('/categories/:id', categoryController.destroy);
}