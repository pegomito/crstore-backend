import orderControlller from "../controllers/orderControlller.js";

export default (app) => {
  app.get("/orders", orderControlller.get);
  app.get("/orders/:id", orderControlller.get);
  app.post("/orders", orderControlller.persist);
  app.patch("/orders/:id", orderControlller.persist);
  app.delete("/orders/:id", orderControlller.destroy);
}