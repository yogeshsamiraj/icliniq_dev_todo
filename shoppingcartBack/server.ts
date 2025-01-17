import express from 'express';
import helmet from 'helmet';
import productRoutes from './route/product/product.route';
import cartRoutes from './route/cart/cart.route';
import connectDB from './db/db';

const app = express();
const port = 5000
// Middleware
app.use(helmet());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(port);
connectDB()

export default app;
