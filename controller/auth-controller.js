const userModel = require("../models/Users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookie = require("cookie-parser");
const {generateToken} = require("../utils/generateTokens");
const productModel = require("../models/Product");

module.exports.registerUser = async (req, res) => {
    try {
        let {email, password, fullname} = req.body;

        // Await the result of userModel.findOne
        let user = await userModel.findOne({email: email});
        let products = await productModel.find();

        // Check if the user already exists
        if (user) {
            return res.send("Account already exists");
        }

        // Hash the password and create the user
        bcrypt.genSalt(10, (err, salt) => {
            if (err) return res.send(err.message);

            bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return res.send(err.message);
                else {
                    // Create the user in the database
                    let newUser = await userModel.create({
                        email,
                        password: hash,
                        fullname
                    });

                    // Generate token and set the cookie
                    let token = generateToken(newUser);
                    res.cookie("token", token);
                    res.render("shop", {products});
                }
            });
        });
    } catch (err) {
        console.log(err.message);
    }
};

module.exports.loginUser = async (req,res) => {
    let {email , password} = req.body;
    let products = await productModel.find();
    let user = await userModel.findOne({email: email});
    if(!user){
        return res.send("Email or Password Incorrect");
    }
    bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err){
            return res.send(err.message);
        }
        if(isMatch){
            let token = generateToken(user);
            res.cookie("token",token);
            res.render("shop", {products});
        }
        else{
            return res.send("Email or Password Incorrect");
        }
    })
}

module.exports.logout = (req,res) => {
    res.cookie("token","");
    res.redirect("/");
}