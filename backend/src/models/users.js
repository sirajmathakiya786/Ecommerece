const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        firstName:{
            type: String,
            required: false
        },
        lastName:{
            type: String,
            required: false
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: false
        },
        phoneNumber:{
            type: String,
            required: false
        },
        referalCode:{
            type: String,
            required: false
        },
        refer:{
            type: String,
            required: false
        },
        referedBy:{
            type: String,
            required: false
        },
        rewards:{
            type: Number,
            required: false
        },
        otp:{
            type: String,
            required: false
        },
        otpExpire:{
            type: Date,
            required: false
        },
        profileImage:{
            type: String,
            required: false
        },
        isActive:{
            type: Boolean,
            default: false,
            required: false
        },
        role:{
            type: String,
            enum:['user','seller','admin']
        }
    },
    { 
        versionKey: false,
        timestamps: true
    }
);

const User = new mongoose.model('users',userSchema);
module.exports = User;