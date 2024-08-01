import jwt from "jsonwebtoken";

const authUser = (req, res, next)=> {
const token = req.headers.authorization;
if (!token){
    return res.status(401).json({message: "Not working!"});
}

jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=>{
   if(err){
    return res.status(401).json({message: "code is wrong!"});
   }

 

   return next();
})


}

export default authUser;