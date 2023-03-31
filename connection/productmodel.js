//this file makes the schema for the types of products that a user can give for laundry. an array for the products will be stored in a seperated file. 

const mongoose = require("mongoose");

//this schema is fetched in the same manner like the storeScehma but is used in the CreateOrder component in UI

let productSchema = new mongoose.Schema({
    productName: String,
    iconurl : Number,
    description: String,
    price: Number,
    wash:Boolean,
    bleach: Boolean,
    iron:Boolean,
    towel: Boolean
});

// console.log(products);
exports.productSchema = productSchema;
