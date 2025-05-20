import productController from "../controllers/productController.js";

export default (app) => {
  app.get("/products", productController.get);
  app.get("/products/:id", productController.get);
  app.post("/products", productController.persist);
  app.patch("/products/:id", productController.persist);
  app.delete("/products/:id", productController.destroy);
  
}