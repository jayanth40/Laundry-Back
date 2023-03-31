//this schema will act as the end db where all the orders will reside.

//it will be fetched in the checkout component where after the order is finalised, a post request will add an entry in the related model

const mongoose = require("mongoose");
//it will have items, totalprice, quantity, orderDate

const orderSchema = new mongoose.Schema({
    items: [
        {
            productName: String,
            quantity: Number,
            washType : Array,
            price: Number,
        }
    ],
    userAddress: 
	    {
    	    stateName:String,
    	    district:String,
    	    pincode:Number,
    	    address:String
	    }
    ,
    orderStatus :String,
    storePhoneNo :String,
    city :String,
    userId: String,
    storeAddress: String,
    billAmt: Number,
    storeLocation: String,
    orderDate: String
});

exports.orderSchema = orderSchema;
