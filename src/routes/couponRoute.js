import couponController from "../controllers/couponController.js";

export default (app) => {
  app.get("/coupons", couponController.get);
  app.get("/coupons/:id", couponController.get);
  app.post("/coupons", couponController.persist);
  app.patch("/coupons/:id", couponController.persist);
  app.delete("/coupons/:id", couponController.destroy);
}