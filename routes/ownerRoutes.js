const express = require("express");
const routes = express.Router();
const {register, login} = require("../controller/admin-auth");
const isLoggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/Product");
const ownerModel = require("../models/Owner"); 

if(process.env.NODE_ENV === "development"){   
    routes.post("/create", register)
}

routes.post("/login", login);

routes.get("/products", isLoggedin, async (req, res) => {
    let products = await productModel.find();
    products.forEach(product => {
        if (product.image) {
            product.image = product.image.toString('base64');
        }
    });
    res.render('product' ,{products: products});
});

routes.get("/create", isLoggedin , async(req,res) => {
    res.render("createproduct");
});
routes.get("/product-sold", isLoggedin, async(req,res) => {
    try {
        let owner = await ownerModel.findOne({ email: req.user.email });

        if (!owner) {
            return res.status(404).send("User not found");
        }

        let Allproduct = owner.products;
        console.log(Allproduct);
        // Pass Allproduct to the EJS template
        res.render("productSold", {Allproduct});
    } catch (error) {
        console.error("Error fetching order history:", error);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = routes; 