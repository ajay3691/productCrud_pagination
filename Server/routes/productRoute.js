import express from 'express';
import Product from '../models/Product.js';
import multer from 'multer';

const productRoute = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname); 
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png',];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); 
    } else {
      cb(new Error('Invalid file type. Only JPEG and PNG are allowed.'), false);
    }
  },
  limits: {
    fileSize: 2 * 1024 * 1024, 
  },
});

productRoute.post('/product', upload.single('image'), async (req, res) => {
  try {
    const { name, code, category, image, description } = req.body;
    const newProduct = new Product({
      name,
      code,
      category,
      image,
      description,
    });

    await newProduct.save();

    res.status(201).json({ product: newProduct, message: 'Product created' });
  } catch (error) {
    if (error.code === 11000) {
      let errorMessage = '';

      if (error.keyPattern.name) {
        errorMessage += 'Name already exists. ';
      }

      if (error.keyPattern.code) {
        errorMessage += 'Code already exists.';
      }

      return res.status(400).json({ error: errorMessage.trim(), message: 'Product not created' });
    }

    res.status(500).json({ error: 'Server error', message: error.message });
  }
});


productRoute.get('/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({ products, message: 'Get all products' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

productRoute.get('/product/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ product, message: 'Get single product' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

productRoute.put('/product/:id', async (req, res) => {
  try {
    const { name, code, category, image, description } = req.body;

    const existingProductByName = await Product.findOne({ name: name, _id: { $ne: req.params.id } });
    const existingProductByCode = await Product.findOne({ code: code, _id: { $ne: req.params.id } });

    if (existingProductByName) {
      return res.status(400).json({ error: 'Name already exists', message: 'Product not updated' });
    }

    if (existingProductByCode) {
      return res.status(400).json({ error: 'Code already exists', message: 'Product not updated' });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        code,
        category,
        image,
        description,
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json({ updatedProduct, message: 'Updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});

productRoute.delete('/product/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});
productRoute.get('/products', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const productsPerPage = 8;
    const skip = (page - 1) * productsPerPage;

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    const products = await Product.find()
      .skip(skip)
      .limit(productsPerPage);

    res.status(200).json({ products, totalPages, currentPage: page, message: 'Get paginated products' });
  } catch (err) {
    res.status(500).json({ error: 'Server error', message: err.message });
  }
});


export default productRoute;
