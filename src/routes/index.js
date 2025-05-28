import userRoute from "./userRoute.js";
import adressRoute from "./adressRoute.js";
import categoryRoute from "./categoryRoute.js";
import paymentRoute from "./paymentRoute.js";
import productRoute from "./productRoute.js";
import orderRoute from "./orderRoute.js";
import order_productRoute from "./order_productRoute.js";
import couponRoute from "./couponRoute.js";
import cartRoute from "./cartRoute.js";

function Routes(app) {
  userRoute(app);
  adressRoute(app);
  categoryRoute(app);
  paymentRoute(app);
  productRoute(app);
  orderRoute(app);
  order_productRoute(app);
  couponRoute(app);
  cartRoute(app);
}

export default Routes;