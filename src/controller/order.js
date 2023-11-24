const Cart = require("../models/cart");
const Order = require("../models/order");
const Product = require("../models/product");
const razorpay = require('../services/razorPayInstance');

// const createOrder = async(req,res)=>{
//     try {
//         const userId = req.user._id;
//         const { cartId, paymentsType } = req.body;
        
//         const cart = await Cart.findOne({ 
//             _id: cartId,
//             userId: userId
//         })
        
//         if (!cart) {
//             return res.status(400).json({
//                 success: false,
//                 message: 'you have no items in the cart',
//             });
//         }
        
//         for (const product of cart.products) {
//             const productId = product.productId;
//             const quantity = product.quantity;

//             const productInDB = await Product.findById(productId);
//             if (!productInDB) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Product not found',
//                 });
//             }

//             if (productInDB.stock < quantity) {
//                 return res.status(400).json({
//                     success: false,
//                     message: 'Insufficient stock for one or more products',
//                 });
//             }
//             productInDB.stock -= quantity;
//             await productInDB.save();
//         }
//         const orderData = {
//             userId,
//             products: cart.products,
//             totalAmount: cart.totalAmount,
//             paymentsType: paymentsType
//         };

//        const order = new Order(orderData);
//        await order.save(orderData);
//        await Cart.findByIdAndDelete(cartId);
       
//         return res.status(201).json({
//             success: true,
//             message: 'Order created successfully',
//             data: order,
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).send({
//             success: false,
//             message: "Internal Server Error",
//             error: error
//         })
//     }
// }

const rednerProductPage = async(req,res)=>{
    res.render('index.hbs');
}

const createOrder = async(req,res)=>{
    try {
        const userId = req.user._id;
        const { cartId } = req.body;
        
        const cart = await Cart.findOne({ 
            _id: cartId,
            userId: userId
        })
        
        if (!cart) {
            return res.status(400).json({
                success: false,
                message: 'you have no items in the cart',
            });
        }
        
        for (const product of cart.products) {
            const productId = product.productId;
            const quantity = product.quantity;

            const productInDB = await Product.findById(productId);
            if (!productInDB) {
                return res.status(400).json({
                    success: false,
                    message: 'Product not found',
                });
            }

            if (productInDB.stock < quantity) {
                return res.status(400).json({
                    success: false,
                    message: 'Insufficient stock for one or more products',
                });
            }
            productInDB.stock -= quantity;
            await productInDB.save();
        }
        
        const options = {
            amount: cart.totalAmount*100,
            currency: "INR",
            receipt: "order_receipt_" + Date.now(),
        };
        const orderData = {
            userId,
            products: cart.products,
            totalAmount: cart.totalAmount,
            currency: "INR",
            receipt: options.receipt,
        };
        const order = await razorpay.orders.create(options);
        const newOrder = new Order(orderData);
        await newOrder.save();
        await Cart.findByIdAndDelete(cartId);
        return res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data:{
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
            }
        });
    } catch (error) {
        // console.log(error);
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}

const allOrders = async(req,res)=>{
    try {
        const orders = await Order.find()
        return res.send(orders);
    } catch (error) {
        return res.status(500).send({
            success: false,
            message: "Internal Server Error",
            error: error
        })
    }
}

module.exports = { createOrder, rednerProductPage, allOrders };