const mongoose = require("mongoose");


const OwnerSchema = mongoose.Schema({
    fullname: {
        type: String,
        minLength: 3,
        trim: true
    },
    email: String,
    password: String,
    cart: {
        type: Array,
        default: []
    },
    products: [
        {
            dateOfsold: {
                type: Date,
                default: Date.now  // Automatically store the date and time of the purchase
            },
            productsSold: [
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
            totalAmountEarned: {
                type: Number,
                required: true  // The total amount paid for the order
            }
        }
    ],
    picture: String,
    gst_no: String
});

module.exports = mongoose.model("Owner", OwnerSchema);