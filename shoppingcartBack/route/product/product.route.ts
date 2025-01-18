import express from 'express';
import { Product } from '../../model/product/product.model';
import image from '../../utils/productImage.json'
const router = express.Router();

const images = image

// Add a new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    const randomIndex = Math.floor(Math.random() * images.length);
const randomValue = images[randomIndex]
    const product = new Product({ name, description, price, quantity, image:randomValue });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error adding product', error });
  }
});

// Update product details
router.post('/update/:id', async (req, res): Promise<any> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error updating product', error });
  }
});

// Delete a product
router.post('/remove/:id', async (req, res): Promise<any> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting product', error });
  }
});

// Fetch product details
router.get('/getproduct/:id', async (req, res): Promise<any> => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching product details', error });
  }
});

// Fetch product details
router.get('/getall', async (req, res): Promise<any> => {
  try {
    const products = await Product.find();
    if (products.length === 0) {
      return res.status(404).json({ message: 'No products found' });
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error });
  }
})

export default router;
