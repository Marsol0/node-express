import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userSchema from '../model/user.js';
import uniqid from 'uniqid';


const SIGN_UP = async (req, res) => {
    try {
        const { name, email, password, money_balance  } = req.body;

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
        const user = new userSchema({
            id: uniqid(),
            name: capitalizedName,
            email: req.body.email,
            password: hash,
            bought_tickets: req.body.bought_tickets,
            money_balance: req.body.money_balance,
        });

         // Save user to database
        await user.save();

        const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "2h" },
            { algorithm: "RS256" }
          );
          const tokenRefresh = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" },
            { algorithm: "RS256" }
          );
       
        
        return res.status(200).json({
            user_model: user,
            token: token,
            tokenRefresh: tokenRefresh,
        });
    } catch (err) {
        console.log("Error message:", err);
        return res.status(400).json({ message: "Emaill addres or password is wrong" });
    }
};

const LOGIN = async (req, res) => {
    try {
        
        // Find user by email
        const user = await userSchema.findOne({ email: req.body.email })

        if (!user) {
            return res.status(404).json({ message: "User not found. Please check email address and try again." });
        }

        // Check password
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: "Wrong password" });
        }
        const token = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" },
            { algorithm: "RS256" }
          );
          const tokenRefresh = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" },
            { algorithm: "RS256" }
          );
     
        return res.status(200).json({
            message: "You have successfully logged in.",
            token: token,
            tokenRefresh: tokenRefresh
        });
    } catch (err) {
        console.log("Error message:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const GET_NEW_JWT_TOKEN = (req, res) => {
    const refreshToken = req.headers.tokenrefresh;
    console.log(refreshToken);
  
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
      
      if (err) {
        return res.status(400).json({ 
            message: "Unauthorized,session expired you need to login" 
        });
      } else {
        const token = jwt.sign(
          {
            email: decoded.email,
          },
          process.env.JWT_SECRET,
          { expiresIn: "2h" },
          { algorithm: "RS256" }
        );
        return res.status(200).json({ new_token: token });
      }
    });
  };

export { SIGN_UP, LOGIN, GET_NEW_JWT_TOKEN };
