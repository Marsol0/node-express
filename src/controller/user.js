import UserModel from '../model/user.js';
import jwt from 'jsonwebtoken';


const SIGN_UP = async(req, res) => {
    try {
        
        const user = ({
            
            name : req.body.name,
            email: req.body.email,
            password: req.body.password,
            money_balance: req.body.money_balance
        });

        // Validate email
        if(!user.email.includes("@")) {
            return res.status(400).json({ message: "Invalid email address, '@' is missing." });
        }
        // Validate user name
        if (!user.name || user.name.length < 3) {
            return res.status(400).json({ message: "User name should be a minimum of 3 letters" });
        }
        user.name = user.name.charAt(0).toUpperCase() + user.name.slice(1);

        // Validate user password
        const passwordRegex = /^(?=.*\d).{6,}$/;
        if(!passwordRegex.test(user.password)) {
            return res.status(400).json({ message: "Password should be at least 6 characters long and contain at least one digit." });
        }
        
        const userModel = await new UserModel(user);
        await userModel.save()
        return res.status(200).json({
            user_model: userModel
        })
    }catch(err) {
        console.log("Error message: ", err)
    }
}

const LOGIN = async(req, res) => {
    const user = await UserModel.findOne({ email: req.body.email });
    if(!user) {
        res.status(404).json({ message: "User not found. Please check email andress and try again" })
    }
  return res.status(200).json({ message: "Log In succesfull" })  
}

export { SIGN_UP, LOGIN }