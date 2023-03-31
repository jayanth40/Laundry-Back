// const express = require('express') ;
// const connection = require('./connection/connection'); 
// const orderRouter = require('./Routes/orders');
// const cors = require('cors')
 

// connection () ;
// const app = express() ;
// app.use(cors());
// app.use(orderRouter)
// const Port = 5000 || process.env.PORT
// app.get('/',(req,res)=>{
//     res.send("Working good")
// })

// app.listen(Port,()=> console.log(`app is running at port ${Port}`)) ;

// =========================jaynats code  ==
const express = require('express') ;
const connection = require('./connection/connection'); 
const {products} = require("./connection/products");
const {productSchema} = require("./connection/productmodel");
const {orderSchema} = require("./connection/orderSchema");
const {stores} = require("./connection/stores");
const {storeSchema} = require("./connection/storeSchema");
const {userSchema} = require("./connection/userSchema");
connection () ;
const mongoose = require("mongoose");
const app = express() ;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const cors = require('cors');
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  }));
  
app.use(express.json());
const Port = 5000 || process.env.PORT
app.use(express.json());


//---------------defining the productsModel that has the data of types of products that a user can give for washing------------------------

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



app.post("/signup", async (req, res) => {
    const {
      name,
      email,
      password,
      stateName,
      district,
      phone,
      pincode,
      address,
    } = req.body;
  
    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);
  
    // Create new user document
    const user = new userModel({
      name,
      email,
      phone,
      stateName,
      district,
      pincode,
      address,
      password: hashedPassword,
    });
  
    // Save user to database
    await user.save();
  
    // Send response
    res.status(201).send("User created successfully.");
  });
  
  // Sign in route
  app.post("/signin", async (req, res) => {
    const { email, password, phone } = req.body;
  
    // Find user by email
    const user = await userModel.findOne({ $or: [{ email }, { phone }] });
    
    // If user doesn't exist, send error response
    if (!user) {
      return res.status(401).send("Invalid email or password.");
    }
  
    // Verify password with bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password);
  
    // If password is invalid, send error response
    if (!passwordMatch) {
      return res.status(401).send("Invalid email or password.");
    }
  
    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, "secret_key", {
      expiresIn: "1h",
    });
  
    // Store token in HTTP-only cookie
    res.cookie("jwt", token, {
     sameSite:"none",
      httpOnly:false
    });
  
    // Send success response
    if(passwordMatch){res.status(200).json({ message: "Success", token })}
    
  });
    
  
  // Authentication middleware
  const authMiddleware = async (req, res, next) => {
    // console.log(req.headers.authorization.split(" ")[1])
    const token = req.headers.authorization.split(" ")[1];
  
    // If token is missing, send error response
    if (!token) {
      return res.status(401).send("Authentication required.");
    }
  
    try {
      // Verify token with JWT
      const decoded = jwt.verify(token, "secret_key");
  
      // Find user by ID
      const user = await userModel.findById(decoded.userId);
  
      // If user not found, send error response
      if (!user) {
        return res.status(401).send("Authentication required.");
      }
  
      // Set user on request object for future use
      req.user = user;
  
      // Call next middleware
      next();
    } catch (error) {
      // If token is invalid or expired, send error response
      res.status(401).send("Authentication required.");
    }
  };
  
  // Protected route for getting user name
  app.get("/protected", authMiddleware, (req, res) => {
    res.status(200).send(req.user.name);
  });
  
  // Log out route
 app.post("/logout", (req, res) => {
    // Clear JWT cookie
    res.clearCookie("jwt");
  
    // Send success response
    res.status(200).send("Logged out successfully.");
  });



//------------defining the end-points for use-----------------------------------------
app.get('/',(req,res)=>{
    res.send("Working good")
})
//-----------for getting all the types of products------------------------------------

app.get("/products",authMiddleware,async (req,res)=>{
    const list = await productModel.find();
    res.send(list);
});

//------------------------------------------------------------------------------------

app.get("/users",authMiddleware, async (req,res)=>{
    const users = await userModel.find();
    res.status(200).send(users);
})

//---------------this endpoint will create a new order of the selected items out of the productsModel and add it to the orderModel------------
app.post("/order", authMiddleware,async (req, res) => {
    try {
        const id = req.user.id
        
        // const id = "12345"
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


//------------------this fetches the orders that have been placed/created-----------
app.get('/orders',authMiddleware, async (req, res) => {
    try {
        const user = req.user.id
        // const user = "12345"
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
//----------------------------------------------

app.get("/store",authMiddleware,async (req,res)=>{
    const list = await storeModel.find();
    res.send(list);
});

app.put('/orders/:id',authMiddleware, async (req, res) => {
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
  
//---------------------------------------------------------------
app.listen(Port,()=> console.log(`app is running at port ${Port}`)) ;