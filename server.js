const express = require("express");
const connectDB = require("./config/db");
const userRegisterRouter = require("./routes/api/users");
const userLoginRouter = require("./routes/api/auth");
const productsRouter = require("./routes/api/products");

const app = express();

// Connect to database
connectDB();

// Init express middleware
app.use(express.json({ extended: false }));

// Define Routes
app.use(userRegisterRouter);
app.use(userLoginRouter);
app.use(productsRouter);

app.get("/", (req, res) => {
  res.send("Welcome");
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server started on ${port}`));
