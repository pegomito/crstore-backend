import order_productController from "../controllers/order_productController.js";

export default (app) => {
  app.get("/order_products", order_productController.get);
  app.get("/order_products/:id", order_productController.get);
  app.post("/order_products", order_productController.persist);
  app.patch("/order_products/:id", order_productController.persist);
  app.delete("/order_products/:id", order_productController.destroy);
}