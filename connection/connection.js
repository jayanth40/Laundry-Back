const mongoose = require('mongoose');
 
const url = 'mongodb+srv://jay:jay@cluster0.walqjnt.mongodb.net/?retryWrites=true&w=majority'
const connection=async()=>{
    mongoose.set('strictQuery', false);

   try {
     await mongoose.connect(url)
     console.log("mongodb is connected successfully ");

   } catch (e) {
    console.log(e);

   }
}

 module.exports = connection ;