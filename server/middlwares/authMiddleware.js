import dotenv from 'dotenv';
import jsonwebtoken from 'jsonwebtoken';


dotenv.config({path: './.env'});

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message: 'Unauthenticated'});
    }

    try{
        const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    }catch(error){
        console.log(error);
        return res.status(401).json({message: 'Unauthenticated'});
    }
}

export default authMiddleware;