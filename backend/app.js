const express = require('express');
const mongoose = require('mongoose');
const productRouter = require("./routes/Product-routes");
const categoryRouter = require("./routes/Category-routes");
const authRouter = require("./routes/auth"); // Add this line

const app = express();
const cors = require('cors');
app.use(cors());

// Middleware
app.use(express.json());  
app.use("/products", productRouter);  // Public product routes
app.use("/categories", categoryRouter);  // Public category routes
app.use("/api/auth", authRouter); // Add this line to use the auth routes

// MongoDB connection
mongoose.connect("mongodb+srv://ansari:Vi2IFYUdkO4wUGp3@cluster0.zy5rj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log("Connected to DB"))
    .then(() => {
        app.listen(5000, () => console.log("Server is running on port 5000"));
    })
    .catch((err) => console.log(err));
