const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    image: Buffer,
    name: String,
    price: Number,
    discount: {
        type: Number,
        default: 0
    },
    bgColor: String,
    panelColor: String,  
    textColor: String
});

module.exports = mongoose.model("product", ProductSchema);