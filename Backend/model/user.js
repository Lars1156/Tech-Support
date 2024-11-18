const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
    userName : {
        type:String,
        require: true,
        trim: true
    },
    email : {
        type: String,
         required : true,
         trim : true,
         unique : true,
         lowercase: true,
         validate: {
             validator: function (v) {
                 return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
             },
             message: props => `${props.value} is not a valid email!`
         }
    },
    password:{
        type: String , 
        required : true,
        minlength : 8,
         validate : {
            validator: function(v){
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: 'Password must be at least 8 characters long and include an uppercase letter, a lowercase letter, a number, and a special character.'

         }

    },
    role: {
        type: String,
        enum: ['End User', 'Tech Support', 'Admin'],
        default: 'End User'
      },
      tickets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Ticket'
      }],

});

// Pre-save Middlewre the HashPassword

userSchema.pre('save' , async function(next){
    if(this.isModified('password') || this.isNew){
        try {
            const saltRound = 10;
            this.password = await bcrypt.hash(this.password , saltRound);
            next();
        } catch (error) {
            next(error)
        }
    }else{
        next();
    }
});

module.exports = mongoose.model('User', userSchema);