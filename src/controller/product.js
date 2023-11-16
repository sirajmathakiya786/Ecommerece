const { default: mongoose } = require("mongoose");
const FavoriteProduct = require("../models/favoriteProduct");
const Product = require("../models/product");
const User = require('../models/users');

const addProduct = async(req,res)=>{
    try {
        const { productName,description,date,reviews,price } = req.body;
        const isExistsProductName = await Product.findOne({productName});
        if(isExistsProductName){
            return res.status(400).json({ success: false, message: "ProductName Alredy Exists"});
        }
        const productData = new Product({
            productName,
            description,
            date,
            reviews,
            price
        });
        productData.save().then((result)=>{
            return res.status(201).send({
                success: true,
                message: "Product Added Successfully",
                data: result
            })
        }).catch((err)=>{
            return res.status(400).send({
                success: false,
                message: "Product Not Added",
                err: err
            })
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}

const productLikeDislike = (req,res)=>{
    try {
        const userId = req.user._id;
        const { productId, isLike } = req.body;
        FavoriteProduct.findOneAndUpdate(
            { userId, productId },
            { isLike },
            { new: true, upsert: true }
        )
        .then((result) => {
            let message = isLike ? "Product Liked" : "Product Disliked";
            return res.status(200).send({
                success: true,
                message: message,
                data: result
            });
        })
        .catch((err) => {
            return res.status(400).json({
                success: false,
                message: "Try again",
                error: err
            });
        });
    } catch (error) {
        return res.status(500).send({ 
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}

const myLikeProduct = async (req, res) => {
    try {
        const userId = req.user._id;
        const favoriteProducts = await FavoriteProduct.find({ userId: userId, isLike: true}).
        populate('userId','firstName lastName').
        populate('productId');

        return res.status(200).send({
            success: true,
            message: "Liked products fetched",
            data: favoriteProducts
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
};

const allProduct = async(req,res)=>{
    try {
        const userId = req.user._id
        const getAllProduct = await Product.find({ 
            isDelete:false
        }).sort({ createdAt: -1 })
        const promises = getAllProduct.map(async (product) => {
            const likeProduct = await FavoriteProduct.findOne({ userId, productId: product._id });
           
            const productWithLikeStatus = {
              ...product.toObject(),
              isLike: likeProduct ? true : false,
            };
            return productWithLikeStatus;
        });
       const productsWithLikeStatus  = await Promise.all(promises);
       return res.status(200).send({
            success: true,
            message: "Success",
            data: productsWithLikeStatus
       })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
}

const test = async(req,res)=>{
    try {
        const userId = req.user._id;
    
        const productsWithLikeStatus = await Product.aggregate([
            {
                $match: {
                    isDelete: false,
                    status: "Approved"
                }
            },
            {
                $lookup: {
                    from: "productfavorites",
                    let: { productId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ["$userId", new mongoose.Types.ObjectId(userId)] },
                                        { $eq: ["$productId", "$$productId"] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: "likeProduct"
                }
            },
            {
                $addFields: {
                    isLike: { $cond: { if: { $ne: [{ $size: "$likeProduct" }, 0] }, then: true, else: false } }
                }
            },
            {
                $project: {
                    likeProduct: 0 
                }
            }
        ]);
        return res.status(200).send({
            success: true,
            message: "Success",
            data: productsWithLikeStatus
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
    
}

const changeProductStatus = (req,res)=>{
    try {
        const productId = req.params.productId
        const { status } = req.body;
        Product.findByIdAndUpdate(
            { _id:productId},
            { $set: {status} },
            { new: true }
        ).then((result)=>{
            return res.status(200).send({
                success: true,
                message: `Status ${status} Successfully`,
                data: result
            })
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        });
    }
}

const productSearch = async(req,res)=>{
    try {
        const { searchParams } = req.body;
        const regex = new RegExp(searchParams, 'i');
        const products = await Product.find({
            isDelete: false,
            $or:[
                { productName: { $regex: regex } },
                { description: { $regex: regex } },
                { date: { $regex: regex } },
                { price: { $regex: regex } },
                { status: { $regex: regex } }, 
            ]
        });
        if(products.length === 0){
            return res.status(400).send({
                success: false,
                message: "Product Not Found"
            })
        }
        return res.status(200).send({
            success: true,
            message: "Product Found Successfully",
            data: products
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}

const productMultipleSearch = async(req,res)=>{
    try {
        const { productName,description } = req.body;
        const query = {};
        if(productName.length > 0){
            query.productName = { $in: productName };
        }
        if(description.length > 0){
            query.description = { $in: description };
        }    
        const result = await Product.find(query)
        .then((result)=>{
            return res.status(200).send({
                success: true,
                message: "Product Found Successfully",
                data: result
            })
        }).catch((err)=>{
            return res.status(400).send({
                success: false,
                message: "Product Not Found",
                data: err
            })
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}

const deleteProduct = async(req,res)=>{
    try {
        const userId = req.params.userId
        const result = await Product.findOneAndUpdate(
            { _id:userId },
            { $set: { isDelete: true } },
            { new: true }
        )
        return res.status(200).send({
            success: true,
            message: "Product Deleted Successfully",
            data: result
        })
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}



module.exports = { 
    addProduct,
    productLikeDislike,
    myLikeProduct,
    allProduct,
    test,
    changeProductStatus,
    productSearch,
    productMultipleSearch,
    deleteProduct
};