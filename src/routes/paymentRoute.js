import paymentController from "../controllers/paymentController.js";

export default (app) => {
  app.get("/payments", paymentController.get);
  app.get("/payments/:id", paymentController.get);
  app.post("/payments", paymentController.persist);
  app.patch("/payments/:id", paymentController.persist);
  app.delete("/payments/:id", paymentController.destroy);
}