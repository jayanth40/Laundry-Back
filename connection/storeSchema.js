const mongoose = require("mongoose");


let storeSchema = new mongoose.Schema({
    storeName: String,
    label: String,
    address: String,
    telephone: Number
});



exports.storeSchema = storeSchema;

//this schema/model will be used in app.js and then will be fetched in the Checkout component for the store details to be chosen by the user