import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { addProduct, deleteProduct, updateProduct, getAllProducts } from "src/api/index";
import Popup from "../popup";
import "./style.css";

export interface ProductInterface {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  description: string;
}

const ListCard: React.FC = (): any => {
  const [products, setProducts] = useState<ProductInterface[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Partial<ProductInterface>>({});
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response?.data);
      } catch (error) {
        setErrorMessage("Failed to fetch products. Please try again later.");
      }
    };
    fetchData();
  }, []);

  const handleOpenDialog = (product?: ProductInterface) => {
    setCurrentProduct(product || {});
    setIsEditMode(!!product);
    setIsDialogOpen(true);
    setFormErrors({});
    setErrorMessage(null);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentProduct({});
  };

  const validateFields = () => {
    let errors: { [key: string]: string } = {};
    if (!currentProduct.name) errors.name = "Name is required.";
    if (!currentProduct.price || currentProduct.price <= 0)
      errors.price = "Valid price is required.";
    if (!currentProduct.quantity || currentProduct.quantity <= 0)
      errors.quantity = "Quantity is required.";
    if (!currentProduct.description)
      errors.description = "Description is required.";
    return errors;
  };

  const handleSave = () => {
    const errors = validateFields();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (isEditMode && currentProduct._id) {
      const updateData = {
        name: currentProduct.name,
        price: currentProduct.price,
        quantity: currentProduct.quantity,
        description: currentProduct.description,
      };

      updateProduct(currentProduct._id, updateData)
        .then((response: any) => {
          setProducts((prev: any) =>
            prev?.map((product: any) =>
              product._id === response.data._id
                ? ({ ...response.data } as ProductInterface)
                : product
            )
          );
          handleCloseDialog();
        })
        .catch((error) => {
          setErrorMessage("Failed to update product. Please try again.");
        });
    } else {
      const saveProduct = {
        name: currentProduct.name,
        price: currentProduct.price,
        quantity: currentProduct.quantity,
        description: currentProduct.description,
      };
      addProduct(saveProduct)
        .then((response) => {
          setProducts((prev: any) => [
            ...(Array.isArray(prev) ? prev : []),
            { ...response.data } as ProductInterface,
          ]);
          handleCloseDialog();
        })
        .catch((error) => {
          setErrorMessage("Failed to add new product. Please try again.");
        });
    }
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setIsConfirmDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete)
        .then(() => {
          setProducts((prev: any) => prev?.filter((product: any) => product._id !== productToDelete));
          setIsConfirmDeleteOpen(false);
        })
        .catch((error) => {
          setErrorMessage("Failed to delete product. Please try again.");
          setIsConfirmDeleteOpen(false);
        });
    }
  };

  return (
    <div className="products-page">
      {/* Topbar */}
      <div className="topbar">
        <h1 className="company-name">icliniq_dev_todo</h1>
        <span className="profile-name">Yogesh</span>
      </div>
<div className="product-label">
  <span>
  <h2>Products</h2>

  </span>
  <div>
  <button className="add-button" onClick={() => handleOpenDialog()}>
    <div style={{display:'flex'}}>
      <FaPlus />
      <div>
      Add New Product
        </div>
    </div>
  </button>
  </div>

</div>
     
      <div className="products-grid">
        {products?.map((product) => (
          <div className="product-card" key={product._id}>
            <img
              className="product-image"
              src={product.image}
              alt={product.name}
            />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p>${product.price.toFixed(2)}</p>
              <p>Quantity: {product.quantity}</p>
            </div>
            <div className="product-actions">
              <button className="edit-button" onClick={() => handleOpenDialog(product)}>
                <FaEdit />
              </button>
              <button className="delete-button" onClick={() => handleDelete(product._id)}>
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Error dialog */}
      {errorMessage && (
        <Popup
          type="error"
          message={errorMessage}
          onClose={() => setErrorMessage(null)}
        />
      )}

      {/* Confirmation dialog */}
      {isConfirmDeleteOpen && (
        <Popup
          type="confirmation"
          message="Are you sure you want to delete this product?"
          onConfirm={confirmDelete}
          onClose={() => setIsConfirmDeleteOpen(false)}
        />
      )}

      {/* Dialog for Add/Edit */}
      {isDialogOpen && (
        <div className="dialog-overlay">
          <div className="dialog animate-popup">
            <h2>{isEditMode ? "Edit Product" : "Add New Product"}</h2>
            <label>
              Name:
              <input
                type="text"
                value={currentProduct.name || ""}
                onChange={(e) =>
                  setCurrentProduct({ ...currentProduct, name: e.target.value })
                }
              />
              {formErrors.name && (
                <span className="error">{formErrors.name}</span>
              )}
            </label>
            <label>
              Price:
              <input
                type="number"
                value={currentProduct.price || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    price: parseFloat(e.target.value) || 0,
                  })
                }
              />
              {formErrors.price && (
                <span className="error">{formErrors.price}</span>
              )}
            </label>
            <label>
              Quantity:
              <input
                type="number"
                value={currentProduct.quantity || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    quantity: parseInt(e.target.value) || 0,
                  })
                }
              />
              {formErrors.quantity && (
                <span className="error">{formErrors.quantity}</span>
              )}
            </label>
            <label>
              Description:
              <textarea
                value={currentProduct.description || ""}
                onChange={(e) =>
                  setCurrentProduct({
                    ...currentProduct,
                    description: e.target.value,
                  })
                }
              />
              {formErrors.description && (
                <span className="error">{formErrors.description}</span>
              )}
            </label>
            <div className="dialog-actions">
              <button className="cancel-button" onClick={handleCloseDialog}>
                Cancel
              </button>
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListCard;
