const express = require("express");
const path = require("path")
const bodyParser = require("body-parser");
const cors = require("cors")
const PORT = 6060;
require('dotenv').config();
require("./src/config/mongooseDb");

const userRoutes = require("./src/routes/user");
const productRoutes = require("./src/routes/product");
const cartRouter = require('./src/routes/cart');

const app = express();
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/users",userRoutes);
app.use("/product",productRoutes);
app.use("/cart", cartRouter);

app.listen(PORT, () =>{
    console.log(`Server Running on  ${PORT}`);
})

