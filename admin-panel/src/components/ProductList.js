import React, { useEffect, useState } from 'react';
import { 
  Typography, 
  Grid, 
  TextField, 
  Select, 
  MenuItem, 
  Button, 
  Container, 
  Paper, 
  Table, 
  TableHead, 
  TableRow, 
  TableCell, 
  TableBody 
} from '@mui/material'; 
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    productDescription: '',
    productCategory: '',
    productPrice: '',
    productStock: ''
  });
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/products');
      setProducts(response.data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.productName || !newProduct.productCategory) {
      console.error('Name and Category are required fields.');
      return;
    }

    try {
      if (isEditing) {
        // Update existing product
        await axios.put(`http://localhost:5000/products/${editProductId}`, newProduct);
      } else {
        // Add new product
        await axios.post('http://localhost:5000/products', newProduct);
      }

      setNewProduct({
        productName: '',
        productDescription: '',
        productCategory: '',
        productPrice: '',
        productStock: ''
      });
      setShowAddProductForm(false);
      setIsEditing(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const handleEditProduct = (product) => {
    setNewProduct({
      productName: product.productName,
      productDescription: product.productDescription,
      productCategory: product.productCategory,
      productPrice: product.productPrice,
      productStock: product.productStock
    });
    setEditProductId(product._id);
    setIsEditing(true);
    setShowAddProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      fetchProducts(); // Refresh the product list after deletion
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  // Modal styles
  const styles = {
    modal: {
      display: 'flex',
      position: 'fixed',
      zIndex: 1,
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#2e2e2e', // Dark theme for modal content
      width: '400px',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      color: '#fff', // White text color for dark background
    },
    addButton: {
      backgroundColor: '#4caf50',
      color: '#fff',
    },
    closeButton: {
      backgroundColor: '#f44336',
      color: '#fff',
    },
    inputField: {
      marginBottom: '10px',
    },
  };

  return (
    <Container maxWidth="lg">
      <Paper elevation={3} style={{ padding: '16px' }}>
        <Typography variant="h4" gutterBottom>
          Product List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setShowAddProductForm(!showAddProductForm);
            setIsEditing(false);
            setNewProduct({
              productName: '',
              productDescription: '',
              productCategory: '',
              productPrice: '',
              productStock: ''
            });
          }}
          style={{ marginBottom: '20px' }}
        >
          {showAddProductForm ? 'Hide Add Product Form' : 'Add New Product'}
        </Button>

        {showAddProductForm && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <Typography variant="h5" gutterBottom>
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Name"
                    fullWidth
                    value={newProduct.productName}
                    onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
                    style={styles.inputField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    fullWidth
                    value={newProduct.productDescription}
                    onChange={(e) => setNewProduct({ ...newProduct, productDescription: e.target.value })}
                    style={styles.inputField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Select
                    label="Category"
                    fullWidth
                    value={newProduct.productCategory}
                    onChange={(e) => setNewProduct({ ...newProduct, productCategory: e.target.value })}
                    style={styles.inputField}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category._id} value={category._id}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Price"
                    type="number"
                    fullWidth
                    value={newProduct.productPrice}
                    onChange={(e) => setNewProduct({ ...newProduct, productPrice: e.target.value })}
                    style={styles.inputField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Stock"
                    type="number"
                    fullWidth
                    value={newProduct.productStock}
                    onChange={(e) => setNewProduct({ ...newProduct, productStock: e.target.value })}
                    style={styles.inputField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    style={styles.addButton}
                    onClick={handleAddProduct}
                    style={{ marginRight: '10px' }}
                  >
                    {isEditing ? 'Update Product' : 'Add Product'}
                  </Button>
                  <Button
                    variant="contained"
                    style={styles.closeButton}
                    onClick={() => setShowAddProductForm(false)}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        )}

        {/* Product List Table */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.productDescription}</TableCell>
                <TableCell>
                  {categories.find((cat) => cat._id === product.productCategory)?.categoryName || 'Unknown'}
                </TableCell>
                <TableCell>{product.productPrice}</TableCell>
                <TableCell>{product.productStock}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<EditIcon />} 
                    style={{ marginRight: '10px' }}
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    startIcon={<DeleteIcon />} 
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
};

export default ProductList;
