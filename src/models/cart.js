const mongoose = require('mongoose');

const cartSchema = mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
            required: true
        },
        products:[{
            productId:{
                type: mongoose.Schema.Types.ObjectId,
                ref: "products"
            },
            quantity:{
                type: Number,
                required: true
            },
            price:{
                type: Number,
                required: true
            }
        }],
        totalAmount:{
            type: Number,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

const Cart = mongoose.model('carts', cartSchema);
module.exports = Cart;