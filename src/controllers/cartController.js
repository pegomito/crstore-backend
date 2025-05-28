import User from "../models/UsersModel.js";

export const getCart = async (req, res) => {
  try {
    const userId = req.user.idUser || req.user.id; 
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    return res.status(200).json({ cart: user.cart || { itens: [], subtotal: 0, frete: 0, total: 0 } });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const userId = req.user.idUser || req.user.id;
    const { cart } = req.body;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    user.cart = cart;
    await user.save();
    return res.status(200).json({ message: "Carrinho atualizado", cart: user.cart });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const userId = req.user.idUser || req.user.id;
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Usuário não encontrado" });
    user.cart = { itens: [], subtotal: 0, frete: 0, total: 0 };
    await user.save();
    return res.status(200).json({ message: "Carrinho limpo" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};