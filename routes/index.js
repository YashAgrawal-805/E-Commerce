const express = require("express");
const router = express.Router();
const isLoggedin = require("../middlewares/isLoggedin");
const productModel = require("../models/Product");
const userModel = require("../models/Users");

router.get("/" , (req,res) => {
    res.render("index");
})

router.get("/shop", isLoggedin, async (req,res) => {
    let products = await productModel.find();
    res.render("shop", {products});
})

router.get("/addtocart/:productid", isLoggedin, async (req,res) => {
    try{let user = await userModel.findOne({email: req.user.email});
    if (user.cart.includes(req.params.productid)) {
        return res.redirect("/shop");
    }
    user.cart.push(req.params.productid);
    await user.save();
    res.redirect("/shop");}
    catch (error){
        console.log(error);
    }
})

router.get("/Deletefromcart/:productid", isLoggedin, async (req, res) => {
    try {
        // Find the user based on their email
        let user = await userModel.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).send("User not found");
        }

        // Remove the product from the user's cart
        user.cart = user.cart.filter(item => item.toString() !== req.params.productid);

        // Save the updated user document
        await user.save();

        // Redirect to the cart page or send success message
        res.redirect("/users/cart");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
router.get("/deleteproduct/:productid", isLoggedin, async (req, res) => {
    try {
        // Find the product by its ID, which is passe in the request parameters
        let product = await productModel.findById(req.params.productid);

        if (!product) {
            return res.status(404).send("Product not found");
        }

        // Perform any actions to delete the product (if required)
        // For example, you can delete it from the database:
        await productModel.deleteOne({ _id: req.params.productid });

        // Redirect to a suitable page or send a success message
        res.redirect('/owners/products'); // Change this as per your application logic
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});
module.exports = router;