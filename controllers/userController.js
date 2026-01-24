import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';


//Register User : /api/user/register
export const register = async (req, res) => {
    try {
        let { name, email, password } = req.body;
        email = email.toLowerCase().trim();

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'missing Details' });

        }


        const existingUser = await User.findOne({ email });

        if (existingUser)
            return res.json({ success: false, message: 'User Already Exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true, //Prevent JavaScript to access coookie
            secure: process.env.NODE_ENV === 'production', //Use secure cookie in production
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF protection
            maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiration time

            // httpOnly: true,
            // sameSite: "lax",   // important
            // secure: false      // true only in HTTPS
        });

        return res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, }, });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//Login User : /api/user/login

export const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.toLowerCase().trim();

        if (!email || !password) {
            return res.json({ success: false, message: 'Email and password are required', });
        }


        const user = await User.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: 'Invailid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({ success: false, message: 'Invailid email or password' });
        }


        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,

        });

        return res.json({ success: true, user: { id: user._id, name: user.name, email: user.email, }, });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message, });

    }
}

//check Auth : /api/user/is-auth
export const isAuth = async (req, res) => {
    try {
        // const { userId } = req.body;
        const user = await User.findById(req.userId).select("-password");
        if (!user) {
            return res.json({
                success: false,
                message: error.message,
            });
        }
        return res.json({ success: true, user, });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//Logout User : /api/user/logout

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        });
        return res.json({ success: true, message: "Logged Out Successfully" });
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};