const mongoose = require('mongoose');


const orderSchema = mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        products:[
            {
                productId:{
                    type:  mongoose.Schema.Types.ObjectId,
                    as: "products"
                },
                quantity:{
                    type: Number,
                    required: false
                },
                price:{
                    type: Number,
                    required: false
                },
            },    
        ],
        totalAmount:{
            type: Number,
            required: false
        },
        currency:{
            type: String,
            required: false
        },
        receipt:{
            type: String,
            required: false
        },
    },
    {
        versionKey: false,
        timestamps: true
    }
);

const Order = mongoose.model('orders', orderSchema);
module.exports = Order;