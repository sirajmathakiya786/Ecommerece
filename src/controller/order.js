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
    const orders = await Order.find()
    // console.log(orders);
    res.render('index.hbs', {orders:orders});
}

const createOrder = async(req,res)=>{
    try {
        const userId = req.user._id;
        const cartId = req.body.cartId
        //const { cartId } = req.body;
        
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
            // key_id:RAZORPAY_ID_KEY,
            product_name:req.body.name,
            description:req.body.description,
            contact:"8567345632",
            name: "Siraj",
            email: "sirajmathakiya.vhits@gmail.com"
        };
        const order =  razorpay.orders.create(options,(err,order)=>{
            if(!err){
                res.status(200).send({
                    success:true,
                    msg:'Order Created',
                    order_id:order.id,
                    amount:amount,
                    key_id:RAZORPAY_ID_KEY,
                    contact:"8238830466",
                    name: "Siraj",
                    email: "sirajmathakiya.vhits@gmail.com"
                });
            }
            else{
                res.status(400).send({success:false,msg:'Something went wrong!'});
            }
        });
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
        console.log(error);
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