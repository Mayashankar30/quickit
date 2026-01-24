import Order from "../models/Order.js";
import Product from "../models/Product.js";



//Place Order COD : /api/order/cod
export const placeOrderCOD = async (req, res) => {
    try {
        const { userId, items, address } = req.body;
        if (!address || items.length === 0) {
            return res.json({ success: false, message: "Invailid data" })
        }
        //Calculate Amount Using Items
        let amount = await items.reduce(async (acc, item) => {
            const product = await Product.findById(item.product);
            return (await acc) + product.offerPrice * item.quantity;
        }, 0)

        //Add Tax Charge(2%)
        amount += Math.floor(amount * 0.02);

        await Order.create({
            userId,
            items,
            amount,
            address,
            paymentType: "COD"
        });

        return res.json({ success: true, message: "Order Place Successfully" })

    } catch (error) {
        return res.json({ success: false, message: error.message })
    }
}

//Get Order by User ID : /api/order/user
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId })
      .populate('items.product')
      .sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// export const getUserOrders = async (req, res) => {
//     try {
//         const { userId } = req.body;
//         const Orders = await Order.find({
//             userId,
//             $or: [{ paymentType: "COD" }, { ispaid: true }]
//         }).populate("items.product address").sort({ createdAt: -1 });
//         res.json({ success: true, Orders });

//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// }

//Get All Orders (for seller  / admin ): /api/order/seller
export const getAllOrders = async (req, res) => {
    try {
        const Orders = await Order.find({
            $or: [{ paymentType: "COD" }, { ispaid: true }]
        }).populate("items.product address").sort({ createdAt: -1 });
        res.json({ success: true, Orders });

    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}
