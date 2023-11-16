const Address = require("../models/address");
const Cart = require("../models/cart");
const Product = require("../models/product");
const User = require("../models/users");
const { StatusCodes } = require('http-status-codes'); 

const addToCart = async(req,res)=>{
    try {
        const userId = req.user._id;
        const { productId, quantity, price, type } = req.body;
        
        let cart = await Cart.findOne({ userId });

        if (cart) {
            let existingProductIndex  = cart.products.findIndex(p => p.productId == productId);
            console.log(existingProductIndex);
            if (existingProductIndex  > -1) {
                if(type === "+"){
                    cart.products[existingProductIndex ].quantity += quantity;
                    cart.products[existingProductIndex ].price += price;
                    cart.totalAmount += price * quantity;
                }else if(type === "-"){
                    cart.products[existingProductIndex].quantity -= quantity;
                    cart.products[existingProductIndex].price -= price;
                    cart.totalAmount -= price * quantity;      
                }
                else{
                    cart.products[existingProductIndex ].quantity += quantity;
                    cart.products[existingProductIndex ].price += price;
                    cart.totalAmount += price * quantity;
                }
            } else {
                cart.products.push({ productId, quantity,  price });
                cart.totalAmount += price * quantity;
            }
            cart = await cart.save();
            return res.status(201).send({ 
                success: true, 
                message: "Cart Updated", 
                data:cart
            });
        } else {
            const newCart = await Cart.create({
                userId,
                products: [{ productId, quantity,  price }],
                totalAmount: price * quantity
            });
            return res.status(201).send({ 
                success: true, 
                message: "Cart Added Successfully", 
                data:newCart
            });
        }
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}

const getCart = async (req, res) => {
    try {
        const userId = req.user._id
        const getAllCart = await Cart.find({}).
        populate("products.productId").
        populate('userId','firstName lastName');

        return res.status(200).send({
            success: StatusCodes.OK,
            message: "Cart Get Successfully",
            data: getAllCart
        })
    } catch (error) {
        return res.status(500).send({
            success: StatusCodes.INTERNAL_SERVER_ERROR,
            message: "Internal Server Error",
            error: error,
        });
    }
};


const addToAddress = (req,res)=>{
    try {
        const userId = req.user._id
        const { addressName,state,city,zipcode } = req.body;
        Address.findOne({ userId:userId })
        .then((existingAddress)=>{
            if(existingAddress){
                existingAddress.address.push({
                    addressName,state,city,zipcode
                })
                return existingAddress.save();
            }else{
                return Address.create({
                    userId:userId,
                    address:[{
                        addressName,
                        state,
                        city,
                        zipcode
                    }]
                })
            }
        }).then((result)=>{
            return res.status(201).send({
                success: true,
                message: "Address Added Successfully",
                data: result
            })
        }).catch((err)=>{
            return res.status(400).send({
                success: false,
                message: "Address Not Added. Please Try Again",
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


module.exports = {
    addToCart,
    addToAddress,
    getCart
}