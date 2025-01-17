import request from 'supertest';
import app from '../../../server';
import { Product } from '../../../model/product/product.model';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    // Start in-memory MongoDB server
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // Disconnect any existing connections before connecting to the in-memory DB
    await mongoose.disconnect();
    
    // Connect to the in-memory database
    await mongoose.connect(mongoUri, {});
  });
  
  afterAll(async () => {
    // Close mongoose connection and stop the in-memory server after tests
    await mongoose.disconnect();
    await mongoServer.stop();
  });

describe('POST /products', () => {
    it('should add a new product successfully', async () => {
      const newProduct = {
        name: 'Test Product',
        description: 'A product for testing',
        price: 100,
        quantity: 50,
      };
  
      const response = await request(app).post('/api/products').send({ _id: '1', ...newProduct});
  
      expect(response.status).toBe(201);
      expect(response.body.name).toBe(newProduct.name);
      expect(response.body.price).toBe(newProduct.price);
      expect(response.body.quantity).toBe(newProduct.quantity);
  
      // Check if the product is saved in the database
      const product = await Product.findById(response.body._id);
      expect(product).not.toBeNull();
    });
  });

describe('PUT /products/:id', () => {
    it('should update product details successfully', async () => {
        const product = await Product.create({
            name: 'Product to update',
            description: 'Update me',
            price: 100,
            quantity: 30,
          });
        
    expect(product._id).toBeDefined();

      const response = await request(app).post(`/api/products/update/${product._id}`).send(product);
  
      expect(response.status).toBe(200);
      expect(response.body.name).toBe(product.name);
      expect(response.body.description).toBe(product.description);
      expect(response.body.price).toBe(product.price);
    });
  
    it('should return 404 for non-existing product', async () => {
      const response = await request(app).put('/products/nonexistentId').send({
        name: 'Non-existent Product',
      });
  
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /products/:id', () => {
    it('should delete product successfully', async () => {
      const product = await Product.create({
        name: 'Product to delete',
        description: 'Delete me',
        price: 100,
        quantity: 30,
      });
    
      expect(product._id).toBeDefined();
    // Delete the product using the correct _id
    const response = await request(app).post(`/api/products/remove/${product._id}`);

    // Check if the response status is 200
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Product deleted successfully');

    // Verify that the product is deleted from the database
    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct).toBeNull(); 
    });
  });
  
  
