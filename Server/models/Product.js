import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  code: {
    type: String,
    unique: true,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  description: String,
});

const Product = mongoose.model('Product', productSchema);

export default Product;
