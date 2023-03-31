//this file contains the list of all the type of products a user can give in an order. in the second part of this file, we send the array called products to the model named productModel



const products = [
    {
        productName: 'jeans',
        iconurl : 0,
        description: "Strong, durable and BLUE!!!",
        price: 100,
        wash:true,
        bleach: false,
        iron: true,
        towel: false
    },
    {
        productName: 'shirt',
        iconurl : 1,
        description: "Formal, Simple and Clean",
        price: 50,
        wash:true,
        bleach: true,
        iron: true,
        towel: false
    },
    {
        productName: 'tshirt',
        iconurl : 2,
        description: "Simple, has your favorite motivational quote",
        price: 40,
        wash:true,
        bleach: false,
        iron: true,
        towel: false
    },
    {
        productName: 'trouser',
        iconurl : 3,
        description: "Formal and will help you in your interview",
        price: 100,
        wash:true,
        bleach: false,
        iron: true,
        towel: false
    },
    {
        productName: 'boxers',
        iconurl : 4,
        description: "When life is tough, they'll never leave you hanging",
        price: 10,
        wash:true,
        bleach: false,
        iron: false,
        towel: true
    },
    {
        productName: 'jogger',
        iconurl : 5,
        description: "Not only for jogging",
        price: 30,
        wash:true,
        bleach: false,
        iron: true,
        towel: true
    }
]


exports.products = products;