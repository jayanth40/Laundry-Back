const mongoose = require('mongoose');

let userSchema = new mongoose.Schema({
    name:String,
    email:String,
    phone:Number,
    addresses: [
	    {
    	    stateName:String,
    	    district:String,
    	    pincode:Number,
    	    address:String
	    }
    ], //user will have an option to add an address, this will require to store multiple addresses in an array.
    password:String
});

exports.userSchema= userSchema;

//this is just for the demo data, feel free to use the final submission from jayanth