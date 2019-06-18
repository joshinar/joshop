const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users"
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now()
  }
});

const Product = mongoose.model("products", ProductSchema);
module.exports = Product;
