const jwt = require('jsonwebtoken');
const User = require('../model/user'); 
const SECRET = "Kishan@1156";
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token,SECRET );
    // console.log(decoded)
    const user = await User.findById(decoded.userId); 



    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next(); 
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = authenticate;

