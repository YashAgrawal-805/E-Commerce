const express = require("express");
const routes = express.Router();
const upload  = require("../config/multer-config");
const productModel = require("../models/Product"); 
const isLoggedin = require("../middlewares/isLoggedin");

routes.post("/create",upload.single("image"),async (req,res) => {
    let {name , price , discount , bgColor , panelColor, textColor} = req.body;
    let products = await productModel.create({
        image : req.file.buffer,
        name , price , discount , bgColor , panelColor, textColor
    })
    res.redirect("/owners/create");
})

module.exports = routes;