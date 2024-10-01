const express = require('express');
const mongoose = require('mongoose');
const productRouter = require("./routes/Product-routes");
const categoryRouter = require("./routes/Category-routes");
const authRouter = require("./routes/auth"); 

const app = express();
const cors = require('cors');
app.use(cors());

app.use(express.json());

const path = require('path');
app.use('/images', express.static(path.join(__dirname, 'uploads')));
app.use("/products", productRouter);  
app.use("/categories", categoryRouter);  
app.use("/api/auth", authRouter); 

mongoose.connect("mongodb+srv://ansari:Vi2IFYUdkO4wUGp3@cluster0.zy5rj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Connected to DB"))
    .then(() => {
        app.listen(5000, () => console.log("Server is running on port 5000"));
    })
    .catch((err) => console.log(err));
