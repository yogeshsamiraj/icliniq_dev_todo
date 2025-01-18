import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ListCard from '../index';
import { addProduct, getAllProducts } from '../../../api';
import React from 'react';
import '@testing-library/jest-dom'

jest.mock('src/api/index', () => ({
  addProduct: jest.fn(),
  getAllProducts: jest.fn()
}));

describe('Add Product', () => {
  it('should add a new product and display it in the list', async () => {
    const mockProduct = {
      _id: '1',
      name: 'Test Product',
      price: 19.99,
      image: 'test-product.jpg',
      quantity: 10,
      description: 'Test Description',
    };

    (addProduct as jest.Mock).mockResolvedValueOnce({ data: mockProduct });

    render(<ListCard />);

    const addButton = screen.getByText('Add New Product');
    fireEvent.click(addButton);

    fireEvent.change(screen.getByLabelText('Name:'), { target: { value: mockProduct.name } });
    fireEvent.change(screen.getByLabelText('Price:'), { target: { value: mockProduct.price.toString() } });
    fireEvent.change(screen.getByLabelText('Quantity:'), { target: { value: mockProduct.quantity.toString() } });
    fireEvent.change(screen.getByLabelText('Description:'), { target: { value: mockProduct.description } });

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
      expect(screen.getByText(`$${mockProduct.price.toFixed(2)}`)).toBeInTheDocument();
      expect(screen.getByText(`Quantity: ${mockProduct.quantity}`)).toBeInTheDocument();
    });

    expect(addProduct).toHaveBeenCalledWith({
      name: mockProduct.name,
      price: mockProduct.price,
      quantity: mockProduct.quantity,
      description: mockProduct.description,
    });
  });
});
