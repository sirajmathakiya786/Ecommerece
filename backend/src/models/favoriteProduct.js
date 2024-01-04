const mongoose = require('mongoose');

const FavoriteProductSchema = mongoose.Schema(
    {
        userId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'users'
        },
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
            required: true
        },
        isLike:{
            type: Boolean,
            required: true
        }
    },
    {
        versionKey: false,
        timestamps: true
    }
);

const FavoriteProduct = mongoose.model('productfavorite',FavoriteProductSchema);
module.exports = FavoriteProduct;