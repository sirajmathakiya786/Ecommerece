const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        productName:{
            type: String,
            required: false
        },
        description:{
            type: String,
            required: false
        },
        date:{
            type: String,
            required: false
        },
        reviews:{
            type: String,
            required: false
        },
        price:{
            type: String,
            required: false
        },
        status:{
            type: String,
            enum: ['Pending', 'Reject', 'Approved'],
            default: 'Pending',
            required: false
        },
        isDelete:{
            type: Boolean,
            default: false,
            required: false
        },
    },
    {   
        versionKey: false,
        timestamps: true
    }
);

const Product = new mongoose.model('products', productSchema);
module.exports = Product;