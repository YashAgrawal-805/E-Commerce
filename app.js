const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
const path = require('path');

const ownerRoutes = require("./routes/ownerRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const indexRoutes = require("./routes/index");
const ejs = require("ejs");
const db = require("./config/mongoose-connection");

const expressSession = require("express-session");

const flash = require("connect-flash");

require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use(
    expressSession({
        resave: false,
        saveUninitialized: false,
        secret: process.env.EXPRESS_SESSION_SECRET
    })
)
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
// app.set('views', path.join(__dirname, 'views'));

app.use("/", indexRoutes);
app.use("/owners",ownerRoutes);
app.use("/users",userRoutes);
app.use("/products",productRoutes);

app.listen(3000);