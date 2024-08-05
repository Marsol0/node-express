import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import userSchema from '../model/user.js';
import uniqid from 'uniqid';


const SIGN_UP = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!email.includes("@")) {
            return res.status(400).json({ message: "Invalid email address, '@' is missing." });
        }

        if (!name || name.length < 3) {
            return res.status(400).json({ message: "User name should be a minimum of 3 letters" });
        }
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        const passwordRegex = /^(?=.*\d).{6,}$/;
        if (!password || !passwordRegex.test(password)) {
            return res.status(400).json({ message: "Password should be at least 6 characters long and contain at least one digit." });
        }

        // Hash password
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        
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
            
          );
          const tokenRefresh = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" },
            
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
            { expiresIn: "2h" },
            
          );
          const tokenRefresh = jwt.sign(
            {
              email: user.email,
              userId: user._id,
            },
            process.env.JWT_SECRET,
            { expiresIn: "24h" },
           
          );
     
        return res.status(200).json({
            Greeting: `Hello ${user.name}`,
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
          
        );
        return res.status(200).json({ new_token: token });
      }
    });
  };


  const GET_ALL_USERS = async (req, res) => {
    try {
       
        const users = await userSchema.find().lean()
        
        
        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found' });
        }
        const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
        
        // Remove _id field from each user object
        const usersWithoutId = sortedUsers.map(({ _id, ...userWithoutMongoId }) => userWithoutMongoId);

        return res.status(200).json({ users: usersWithoutId });
    } catch (error) {
        console.error('Error fetching users:', error);
        return res.status(500).json({ error: 'An error occurred while fetching users.' });
    }
};


const GET_USER_BY_ID = async (req, res) => {
    const id = req.params.id; 
    
    try {
        const user = await userSchema.findOne({ id }).lean()
        // lean() returns simpler object. don't need the full Mongoose document functionality
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        // splits the user object into two parts.
        // A variable named _id is created and assigned the value
        // A new object is created, containing all the properties of user except _id.
        const { _id, ...userWithoutMongoId } = user;
        
        return res.status(200).json({ user: userWithoutMongoId });
    } catch (error) {
        console.error('Error retrieving user:', error); // Log the error for debugging
        return res.status(500).json({ error: 'Error retrieving user' });
    }
};

export { SIGN_UP, LOGIN, GET_NEW_JWT_TOKEN, GET_ALL_USERS, GET_USER_BY_ID };