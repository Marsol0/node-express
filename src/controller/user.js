import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../model/user.js';


const generateToken = (payload, expiresIn) => {
    const secret = process.env.TOKEN_PASSWORD;
    if (!secret) {
        throw new Error('TOKEN_PASSWORD environment variable is not set.');
    }
    return jwt.sign(payload, secret, { expiresIn });
};

const SIGN_UP = async (req, res) => {
    try {
        const { name, email, password, money_balance } = req.body;

        // Validate email
        if (!email.includes("@")) {
            return res.status(400).json({ message: "Invalid email address, '@' is missing." });
        }

        // Validate user name
        if (!name || name.length < 3) {
            return res.status(400).json({ message: "User name should be a minimum of 3 letters" });
        }
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        // Validate user password
        const passwordRegex = /^(?=.*\d).{6,}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password should be at least 6 characters long and contain at least one digit." });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        // Create user model
        const user = new UserModel({
            name: capitalizedName,
            email,
            password: hash,
            money_balance
        });

        const token = generateToken({ email: user.email, userid: user._id }, '12h');
        const refreshToken = generateToken({ email: user.email, userid: user._id }, '1d');

        // Save user to database
        await user.save();
        
        return res.status(200).json({
            user_model: user,
            token,
            refreshToken
        });
    } catch (err) {
        console.log("Error message:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const LOGIN = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ message: "User not found. Please check email address and try again." });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }

        const token = generateToken({ email: user.email, userid: user._id }, '12h');
        const refreshToken = generateToken({ email: user.email, userid: user._id }, '1d');
        
        return res.status(200).json({
            message: "You have successfully logged in.",
            token,
            refreshToken
        });
    } catch (err) {
        console.log("Error message:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const REFRESH_TOKEN = async (req, res) => {
    try {
        const refreshToken = req.headers['x-refresh-token']; // Extract from header
        
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required." });
        }

        // Verify the refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid refresh token." });
            }
            
            // Generate a new access token
            const newToken = generateToken({ email: decoded.email, userid: decoded.userid }, '12h');
            return res.status(200).json({ token: newToken });
        });
    } catch (err) {
        console.log("Error message:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export { SIGN_UP, LOGIN, REFRESH_TOKEN };
