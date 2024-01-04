const mongoose = require('mongoose');

const addressSchema = mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        address:[
            {
                addressName:{
                    type: String,
                    required: false
                },
                state:{
                    type: String,
                    required: false
                },
                city:{
                    type: String,
                    required: false
                },
                zipcode:{
                    type: Number,
                    required: false
                }
            }
        ]
    },
    {
        versionKey: false,
        timestamps: true
    }
);

const Address = mongoose.model('address',addressSchema);
module.exports = Address;