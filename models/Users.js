const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true
    },
    email: String,
    password: String,
    cart: [{
        type: mongoose.Schema.Types.ObjectId,
        default: [],
        ref: 'product'
    }],
    orders: [
        {
            dateOfPurchase: {
                type: Date,
                default: Date.now  // Automatically store the date and time of the purchase
            },
            productsPurchased: [
                {
                    productId: {
                        type: mongoose.Schema.Types.ObjectId,
                        ref: 'Product',  // Assuming there is a Product model
                        required: true
                    },
                    name: {
                        type: String,
                        required: true
                    },
                    price: {
                        type: Number,
                        required: true
                    }
                }
            ],
            totalAmountPaid: {
                type: Number,
                required: true  // The total amount paid for the order
            }
        }
    ],
    contact: Number,
    picture: String
});

module.exports = mongoose.model("users", UserSchema);