    const express = require("express");
    const routes = express.Router();
    const {registerUser , loginUser, logout} = require("../controller/auth-controller")
    const isloggedin = require("../middlewares/isLoggedin");
    const userModel = require("../models/Users");
    const productModel = require("../models/Product")
    const ownerModel = require("../models/Owner"); 

    routes.get("/",(req,res) => {
        res.send("KYU KABIR");
    })

    routes.post("/register", registerUser)

    routes.post("/login", loginUser);

    routes.get("/logout", logout);

    routes.get('/cart', isloggedin, async (req, res) => {
        try {
            // Fetch the user and populate the cart with product details
            let user = await userModel.findOne({ email: req.user.email }).populate('cart');
            if (!user) {
                return res.status(404).send("User not found");
            }

            user.cart.forEach(product => {
                if (product.image) {
                    product.image = product.image.toString('base64');
                }
            });

            // Pass the populated cart to the EJS template
            res.render('cart', { cart: user.cart });
        } catch (error) {
            console.error(error);
            res.status(500).send("Internal Server Error");
        }
    });
    routes.get('/place-order', isloggedin , async(req,res) => {

        try {
            const email = req.user.email;  // Assuming you're using middleware to get the logged-in user
        
            // Find the user by email
            const user = await userModel.findOne({ email: email });
            const owner = await ownerModel.findOne({email: "KABIR@KABIR.com"});

            if (!user) {
                return res.status(404).send({ message: "User not found" });
            }
        
            // Check if the cart is empty
            if (user.cart.length === 0) {
                return res.status(400).send({ message: "Cart is empty" });
            }
        
            const productsPurchased = [];
            let totalAmountPaid = 0;
        
            // Use for...of with async/await to handle asynchronous operations properly
            for (const productId of user.cart) {
                if (!productId) {
                    throw new Error("Invalid product ID in the cart");
                }
        
                const product = await productModel.findOne({ _id: productId });
                if (!product || !product.name || product.price === undefined) {
                    console.error("Invalid product data for ID:", productId);
                    throw new Error("Invalid product data in the cart");
                }
        
                productsPurchased.push({
                    productId: productId,
                    name: product.name,
                    price: product.price
                });
        
                if (isNaN(product.price)) {
                    throw new Error("Invalid price for product ID: " + productId);
                }
        
                totalAmountPaid += product.price;
            }
        
            // Prepare the order object
            const order = {
                productsPurchased,
                totalAmountPaid
            };
            let productsSold = productsPurchased;
            let totalAmountEarned = totalAmountPaid;
            
            const placed = {
                productsSold,
                totalAmountEarned
            };

            // Add the order to the user's order history
            user.orders.push(order);
            owner.products.push(placed);
        
            // Clear the cart
            user.cart = [];
        
            // Save the user document with updated orders and an empty cart
            await user.save();
            await owner.save();
        
            // Send success response
            res.redirect("/users/cart");
        }catch (error) {
            console.error("Error while placing order:", error.message);
            res.status(500).send({ message: `An error occurred: ${error.message}` });
        }
    });
    routes.get('/order-history', isloggedin , async(req,res) => {
        try {
            let user = await userModel.findOne({ email: req.user.email });
    
            if (!user) {
                return res.status(404).send("User not found");
            }
    
            let Allorder = user.orders;
            // Pass Allorder to the EJS template
            res.render("orderhistory", { Allorder });
        } catch (error) {
            console.error("Error fetching order history:", error);
            res.status(500).send("Internal Server Error");
        }
    })

    module.exports = routes;