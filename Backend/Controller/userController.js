// importing the user Model and Services part 
const User = require('../model/user') ;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const secret = "Kishan@1156";

exports.registerUser = async (req, res) => {
    try {
        const { userName, email, password, role } = req.body;

        console.log("User Details:", req.body);

        // Check if all fields are provided
        if (!userName || !email || !password || !role) {
            return res.status(400).json({ msg: 'Please enter all user details' });
        }

        // Check if email already exists in the database
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ msg: 'The email already exists' });
        }

        // Create new user object
        const newUser = {
            userName,
            email,
            password,
            role
        };

        console.log("Creating new user...");

        // Create and save the new user
        const addData = new User(newUser);
        await addData.save();

        return res.status(200).json({ msg: 'User successfully created' });

    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ msg: 'Server error, user not added' });
    }
};
exports.loginUser = async(req,res)=>{
    try {
        const { email, password } = req.body;

        console.log(email,password)
    
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        // Compare entered password with the stored hash
        const isMatch = await bcrypt.compare(password, user.password);
        console.log(isMatch)
        
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
    
        // Generate JWT Token
        const token = jwt.sign(
          { userId: user._id },
          secret,
          { expiresIn: '10h' }  
        );
    
        // Send the response with token and user role
        res.status(200).json({
          token,
          role: user.role,  
        });
      } catch (error) {
        res.status(500).json({ message: 'Server error' });
      }
};

exports.getAllTechSuportUser = async(req,res)=>{
  try {
    // Find all users with the role of 'Tech Support'
    const techSupportUsers = await User.find({ role: 'Tech Support' });

    if (!techSupportUsers.length) {
      return res.status(404).json({ message: 'No Tech Support users found' });
    }

    res.status(200).json({ users: techSupportUsers });
  } catch (error) {
    console.error('Error fetching Tech Support users:', error.message);
    res.status(500).json({ message: 'Server Error' });
  }
};