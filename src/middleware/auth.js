import jwt from 'jsonwebtoken';

const authUser = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: "Authorization token is missing" });
    }

    
        const decryptedInfo = jwt.verify(token, process.env.TOKEN_PASSWORD);

       if (!decryptedInfo) {
        return res.status(401).json({ message: "Auth failed"})
       }
    req.body.owner_id = decryptedInfo.owner_id

        next();
    
};

export default authUser;
