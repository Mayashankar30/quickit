import jwt from 'jsonwebtoken';



//Login Seller : /api/seller/login

export const sellerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (password === process.env.SELLER_PASSWORD && email === process.env.SELLER_EMAIL) {
            const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '7d' });

            res.cookie('sellerToken', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });

            return res.json({ success: true, message: "logged In" });
        } else {
            return res.json({ success: false, message: "Invailid Credentials" })
        }
    } catch (error) {
        console.log(error.message)
        res.json({ success: false, message: error.message });

    }
}

//Seller isAuth :/api/user/is-auth
export const isSellerAuth = async (req, res) => {
    try {
        return res.json({ success: true })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}


// Backend: controllers/sellerController.js
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.userId; 

    const orders = await OrderModel.find() 
      .populate({
        path: 'items.product',
        match: { seller: sellerId } 
      })
      .populate('address')
      .sort({ createdAt: -1 });

    // Only send orders that contain this seller's products
    const sellerOrders = orders.filter(order =>
      order.items.some(item => item.product !== null)
    );

    res.json({ success: true, orders: sellerOrders });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

//Logout Seller : /api/user/logout

export const sellerLogout = async (req, res) => {
    try {
        res.clearCookie('sellerToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        
        });
        return res.json({ success: true, message: "Logged Out" })
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}