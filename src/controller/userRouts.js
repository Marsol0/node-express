import UserModel from '../model/user.js';
import tickedModel from '../model/ticket.js'

const GET_ALL_USERS = async (req, res) => {
    try {
       
        const users = await UserModel.find().lean(); // Fetch all users from the database
        const ticket = await tickedModel.find()
        console.log(0)
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

const BUY_A_TICKET = async(req, res) => {
    
}

const GET_USER_BY_ID = async (req, res) => {
    const id = req.params.id; // Extract id from route parameter
    
    try {
        const user = await UserModel.findOne({ id }).lean(); // Find user by UUID
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

export { GET_ALL_USERS, BUY_A_TICKET, GET_USER_BY_ID }