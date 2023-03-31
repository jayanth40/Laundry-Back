const express = require('express');
const orderRouter = express.Router();
const bodyparser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
orderRouter.use(cookieParser());
const mongoose = require('mongoose')
orderRouter.use(bodyparser.urlencoded({ extended: false }))
orderRouter.use(bodyparser.json())
// const userDetailbyToken = (token) => {
//     return new Promise((resolve, reject) => {
//         if (token) {
//             try {
//                 let userdata = jwt.verify(token, secret) ;
//                 resolve(userdata);

//             } catch (e) {
//                 reject("Invalid token")
//             }

//         } else {
//             reject("token not found ")
//         }
//     })
// }

///==================================================================

 const authMiddleware = async (req, res, next) => {
    const token = req.cookies.jwt;

    // If token is missing, send error response
    if (!token) {
        return res.status(401).send('Authentication required.');
    }

    try {
        // Verify token with JWT
        const decoded = jwt.verify(token, 'secret_key');

        // Find user by ID
        const user = await User.findById(decoded.userId);

        // If user not found, send error response
        if (!user) {
            return res.status(401).send('Authentication required.');
        }

        // Set user on request object for future use
        req.user = user;

        // Call next middleware
        next();
    } catch (error) {
        // If token is invalid or expired, send error response
        res.status(401).send('Authentication required.');
    }
};

//========================================================

// const OrderSchema = new mongoose.Schema({
//     items: [
//         {
//             productName: String,
//             quantity: Number,
//             washType: String,
//             price: Number,
//         }
//     ],
//     userAddress:
//     {
//         stateName: String,
//         district: String,
//         pincode: Number,
//         address: String
//     }
//     ,
//     orderStatus: String,
//     storePhoneNo: String,
//     city: String,
//     userId: String,
//     storeAddress: String,
//     billAmt: Number,
//     storeLocation: String,
//     orderDate: String
// });
// const orderModel = mongoose.model('order', OrderSchema)




//main code =================================================

orderRouter.get('/orders', async (req, res) => {

    try {
        // const user = req.user.id
        const user = "12345"

        const orders = await orderModel.find({ userId: user });
        if (orders) {

            res.status(200).json({
                status: "successfully getting orders",
                orders: orders
            })
        } else {
            res.status(500).json({
                status: "failed",
                message: "no order created by user"
            })
        }

    } catch (e) {
        res.status(500).json({
            status: "failed",
            message: e.message
        })

    }


})
//================ updating order status ============================  


orderRouter.put('/orders/:id', async (req, res) => {
  const orderId = req.params.id;
  console.log(orderId);
  const newOrderStatus = req.body.orderStatus;
  try {
    const order = await orderModel.findByIdAndUpdate(orderId, { orderStatus: newOrderStatus });
    if (!order) {
      return res.status(404).send('Order not found');
    }
    res.send('Order status updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal server error');
  }
});




//============================================ testing =======================

//=================
orderRouter.post("/order", async (req, res) => {

    try {
        // const id = req.user.id
        const id = "12345"

        const { items, orderStatus, userAddress,
            storePhoneNo,
            city,

            storeAddress,
            billAmt,
            storeLocation,
            orderDate } = req.body;
        const order = new orderModel({
            items,
            userId: id,
            userAddress,
            orderStatus,
            storePhoneNo,
            city,
            storeAddress,
            billAmt,
            storeLocation,
            orderDate
        });
        await order.save()
        //    const order  =await Order.create(req.body)
        res.send(order)
    } catch (error) {
        res.json({
            status: "failed",
            message: error.message
        })
    }
});

//==================================================Shubham============================================
const {products} = require("../connection/products");
const {productSchema} = require("../connection/productmodel");
const {orderSchema} = require("../connection/orderSchema");
const {stores} = require("../connection/stores");
const {storeSchema} = require("../connection/storeSchema");
const userSchema = require("../connection/userSchema");
let productModel = mongoose.model("products",productSchema);
let orderModel = mongoose.model("orders",orderSchema);
let storeModel = mongoose.model("stores",storeSchema);
let userModel = mongoose.model("users",userSchema);

const add = async () => {
	await productModel.deleteMany({});
	await productModel.insertMany(products);
    await storeModel.deleteMany({});
	await storeModel.insertMany(stores);
	console.log("added");
};

add();

//------------defining the end-points for use-----------------------------------------
// app.get('/',(req,res)=>{
//     res.send("Working good")
// })
//-----------for getting all the types of products------------------------------------

orderRouter.get("/products",async (req,res)=>{
    const list = await productModel.find();
    res.send(list);
});

//------------------------------------------------------------------------------------

orderRouter.get("/users", async (req,res)=>{
    const users = await userModel.find();
    res.status(200).send(users);
})

//---------------this endpoint will create a new order of the selected items out of the productsModel and add it to the orderModel------------
orderRouter.post("/order",async (req,res)=>{
    const order = await orderModel.create(req.body);
    res.send(order);
});

//------------------this fetches the orders that have been placed/created-----------
// orderRouter.get("/order",async (req,res)=>{
//     const list = await orderModel.find();
//     res.send(list);
// });
//----------------------------------------------

orderRouter.get("/store",async (req,res)=>{
    const list = await storeModel.find();
    res.send(list);
});
//==========================================================
// ========================================== jayants code ===========================



module.exports = orderRouter