import request from 'supertest';
import app from '../../../server'; // Adjust the import path as necessary
import { Cart } from '../../../model/cart/cart.model'; // Adjust the import path as necessary
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Product } from '../../../model/product/product.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  // in-memory MongoDB server
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.disconnect();

  await mongoose.connect(mongoUri, {});
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('POST /cart', () => {
  it('should add an item to the cart successfully', async () => {
    const userId = '60b3b8b8b8b8b8b8b8b8b8b8';
    const productId = '60b3b8b8b8b8b8b8b8b8b8b8';
    const quantity = 2;

    const response = await request(app)
      .post('/api/cart')
      .send({ userId, productId, quantity })
      .expect(201);

    expect(response.body.userId).toBe(userId);
    expect(response.body.items[0]).toHaveProperty('productId', productId);
    expect(response.body.items[0]).toHaveProperty('quantity', quantity);

    const cart = await Cart.findOne({ userId });
    expect(cart).not.toBeNull();
    expect(cart?.items[0].productId.toString()).toBe(productId);
    expect(cart?.items[0].quantity).toBe(quantity);
  });

  it('should create a new cart if the user does not have one', async () => {
    const userId = '60b3b8b8b8b8b8b8b8b8b8b8';
    const productId = '60b3b8b8b8b8b8b8b8b8b8b8';
    const quantity = 3;

    const response = await request(app)
      .post('/api/cart')
      .send({ userId, productId, quantity })
      .expect(201);

    expect(response.body.userId).toBe(userId);
    expect(response.body.items[0]).toHaveProperty('productId', productId);
  });
});

describe('POST /cart/remove/:userId/:productId', () => {
  it('should remove an item from the cart successfully', async () => {
    const userId = '60b3b8b8b8b8b8b8b8b8b8b8';

    const product = await Product.create({
      name: 'Product to delete',
      description: 'Delete me',
      price: 100,
      quantity: 30,
    });

    expect(product._id).toBeDefined()

    const productId = `${product._id}`;

    await request(app)
      .post('/api/cart')
      .send({ userId, productId, quantity: 2 })
      .expect(201);

    const response = await request(app)
      .post(`/api/cart/remove/${userId}/${productId}`)
      .expect(200);

    expect(response.body.items.length).toBe(0);
    const cart = await Cart.findOne({ userId });
    expect(cart?.items.length).toBe(0);
  });

  it('should return 404 if the cart or product is not found', async () => {
    const response = await request(app)
      .post('/api/cart/remove/invalidUserId/invalidProductId')
      .expect(404);

    expect(response.body.message).toBe('Cart not found');
  });
});

describe('GET /cart/view/:userId', () => {
  it('should retrieve the cart for a specific user', async () => {
    const userId = '60b3b8b8b8b8b8b8b8b8b8b8';

    await request(app)
      .post('/api/cart')
      .send({ userId, productId: '60b3b8b8b8b8b8b8b8b8b8b8', quantity: 2 })
      .expect(201);

    const response = await request(app)
      .get(`/api/cart/view/${userId}`)
      .expect(200);

    expect(response.body.userId).toBe(userId);
    expect(response.body.items).toBeInstanceOf(Array);
    expect(response.body.items.length).toBeGreaterThan(0);
  });

  it('should return 404 if the cart is not found', async () => {
    const response = await request(app)
      .get('/api/cart/view/invalidUserId')
      .expect(404);

    expect(response.body.message).toBe('Cart not found');
  });
});

describe('POST /cart/update/:userId', () => {
  it('should update the quantity of an item in the cart', async () => {
    const userId = '60b3b8b8b8b8b8b8b8b8b8b8';
    const productId = '60b3b8b8b8b8b8b8b8b8b8b8';

    await request(app)
      .post('/api/cart')
      .send({ userId, productId: '60b3b8b8b8b8b8b8b8b8b8b8', quantity: 2 })
      .expect(201);

    const response = await request(app)
      .post(`/api/cart/update/${userId}`)
      .send({ productId: '60b3b8b8b8b8b8b8b8b8b8b8', quantity: 5 })
      .expect(200);

    expect(response.body.items[0].quantity).toBe(5);

    const cart = await Cart.findOne({ userId });
    expect(cart?.items[0].quantity).toBe(5);
  });

  it('should return 404 if the item is not found in the cart', async () => {
    const response = await request(app)
      .post('/api/cart/update/invalidUserId')
      .send({ productId: 'invalidProductId', quantity: 5 })
      .expect(404);

    expect(response.body.message).toBe('Cart not found');
  });

  it('should return 404 if the cart is not found', async () => {
    const response = await request(app)
      .post('/api/cart/update/invalidUserId')
      .send({ productId: 'validProductId', quantity: 5 })
      .expect(404);

    expect(response.body.message).toBe('Cart not found');
  });
});
