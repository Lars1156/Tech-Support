const jwt = require('jsonwebtoken');
const  secret = "kishan@1156";

function setUser(user){
    const payload ={
        _id:user._id,
        email:user.email
    }
    return jwt.sign(payload,secret)
}

module.exports = setUser;

