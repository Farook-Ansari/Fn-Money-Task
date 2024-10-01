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
  TableBody,
  TableSortLabel,
  Box,
} from '@mui/material';
import axios from 'axios';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { visuallyHidden } from '@mui/utils';

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    productDescription: '',
    productCategory: '',
    productPrice:'',
    productVariant: '',
    productQuantity: '',
    warehouseLocation: '',
    taxPercentage:'',
    taxCode:'',
    productweight:'',
    productlength:'',
    productwidth:'',
    productheight:'',
    productStatus: '',
    returnAndReplacement:'',
    productImage: null, 
  });
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editProductId, setEditProductId] = useState(null);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('productName');

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
      const formData = new FormData(); 
      formData.append('productName', newProduct.productName);
      formData.append('productDescription', newProduct.productDescription);
      formData.append('productCategory', newProduct.productCategory);
      formData.append('productPrice', newProduct.productPrice);
      formData.append('productStatus', newProduct.productStatus);
      formData.append('productVariant', newProduct.productVariant);
      formData.append('productQuantity', newProduct.productQuantity);
      formData.append('warehouseLocation', newProduct.warehouseLocation);
      formData.append('taxPercentage', newProduct.taxPercentage);
      formData.append('taxCode', newProduct.taxCode);
      formData.append('productweight', newProduct.productweight);
      formData.append('productlength', newProduct.productlength);
      formData.append('productwidth', newProduct.productwidth);
      formData.append('productheight', newProduct.productheight);
      formData.append('returnAndReplacement', newProduct.returnAndReplacement);
      if (newProduct.productImage) {
        formData.append('productImage', newProduct.productImage);
      }

      if (isEditing) {
        await axios.put(`http://localhost:5000/products/${editProductId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        await axios.post('http://localhost:5000/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      setNewProduct({
        productName: '',
        productDescription: '',
        productCategory: '',
        productPrice:'',
        productVariant: '',
        productQuantity: '',
        warehouseLocation: '',
        taxPercentage:'',
        taxCode:'',
        productweight:'',
        productlength:'',
        productwidth:'',
        productheight:'',
        productStatus: '',
        returnAndReplacement: '',
        productImage: null,
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
      productVariant: product.productVariant,
      productQuantity: product.productQuantity,
      warehouseLocation: product.warehouseLocation,
      taxPercentage: product.taxPercentage,
      taxCode: product.taxCode,
      productweight: product.productweight,
      productlength: product.productlength,
      productwidth: product.productwidth,
      productheight: product.productheight,
      returnAndReplacement: product.returnAndReplacement,
      productStatus: product.productStatus,
      productImage: null,
    });
    setEditProductId(product._id);
    setIsEditing(true);
    setShowAddProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:5000/products/${productId}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, productImage: e.target.files[0] });
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((cat) => cat._id === categoryId);
    return category ? category.categoryName : 'Unknown Category';
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const visibleProducts = [...products].sort(getComparator(order, orderBy));

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
      backgroundColor: 'white',
      width: '400px',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
      color: '#fff',
    },
  };

  return (
    <Container maxWidth="250px">
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
              productPrice:'',
              productVariant: '',
              productQuantity: '',
              warehouseLocation: '',
              taxPercentage:'',
              taxCode:'',
              productweight:'',
              productlength:'',
              productwidth:'',
              productheight:'',
              productStatus: '',
              returnAndReplacement: '',
              productImage: null,
            });
          }}
          style={{ marginBottom: '20px', marginLeft:'900px', marginTop:'-70px'}}
        >
          {showAddProductForm ? 'Hide Add Product Form' : 'Add New Product'}
        </Button>

        {showAddProductForm && (
  <div style={styles.modal}>
    <div style={{ ...styles.modalContent, width: '50%', marginLeft: '250px' }}>
      <Typography variant="h5" gutterBottom>
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <TextField
            label="Product Name"
            fullWidth
            value={newProduct.productName}
            onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Product price"
            fullWidth
            value={newProduct.productPrice}
            onChange={(e) => setNewProduct({ ...newProduct, productPrice: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Select
            label="Product price"
            fullWidth
            value={newProduct.productCategory}
            onChange={(e) => setNewProduct({ ...newProduct, productCategory: e.target.value })}
          >
            {categories.map((category) => (
              <MenuItem key={category._id} value={category._id}>
                {category.categoryName}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Warehouse Location"
            fullWidth
            value={newProduct.warehouseLocation}
            onChange={(e) => setNewProduct({ ...newProduct, warehouseLocation: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Tax Percentage"
            fullWidth
            value={newProduct.taxPercentage}
            onChange={(e) => setNewProduct({ ...newProduct, taxPercentage: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Tax Code"
            fullWidth
            value={newProduct.taxCode}
            onChange={(e) => setNewProduct({ ...newProduct, taxCode: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Product Description"
            fullWidth
            value={newProduct.productDescription}
            onChange={(e) => setNewProduct({ ...newProduct, productDescription: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Product Variant"
            fullWidth
            value={newProduct.productVariant}
            onChange={(e) => setNewProduct({ ...newProduct, productVariant: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Product Quantity"
            fullWidth
            value={newProduct.productQuantity}
            onChange={(e) => setNewProduct({ ...newProduct, productQuantity: e.target.value })}
          />
        </Grid>
       
        <Grid item xs={12} md={4}>
          <TextField
            label="Product Weight"
            fullWidth
            value={newProduct.productweight}
            onChange={(e) => setNewProduct({ ...newProduct, productweight: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Product Length"
            fullWidth
            value={newProduct.productlength}
            onChange={(e) => setNewProduct({ ...newProduct, productlength: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Product Width"
            fullWidth
            value={newProduct.productwidth}
            onChange={(e) => setNewProduct({ ...newProduct, productwidth: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            label="Product Height"
            fullWidth
            value={newProduct.productheight}
            onChange={(e) => setNewProduct({ ...newProduct, productheight: e.target.value })}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Select
            label="Return & Replacement"
            fullWidth
            value={newProduct.returnAndReplacement}
            onChange={(e) => setNewProduct({ ...newProduct, returnAndReplacement: e.target.value })}
          >
            <MenuItem value="No Return">No Return</MenuItem>
            <MenuItem value="7 Days Replacement">7 Days Replacement</MenuItem>
            <MenuItem value="30 Days Return">30 Days Return</MenuItem>
          </Select>
        </Grid>
        <Grid item xs={12} md={4}>
          <input type="file" onChange={handleImageChange} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Select
            label="Product Status"
            fullWidth
            value={newProduct.productStatus}
            onChange={(e) => setNewProduct({ ...newProduct, productStatus: e.target.value })}
          >
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Sold">Sold</MenuItem>
          </Select>
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" onClick={handleAddProduct}>
            {isEditing ? 'Update Product' : 'Add Product'}
          </Button>
          <Button
            variant="outlined"
            onClick={() => setShowAddProductForm(false)}
            style={{ marginLeft: '10px' }}
          >
            Close
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
              )}
        <Table>
          <TableHead style={{position:'sticky'}}>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={orderBy === 'productName'}
                  direction={orderBy === 'productName' ? order : 'asc'}
                  onClick={() => handleRequestSort('productName')}
                >
                  Product Name
                  {orderBy === 'productName' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>Product Price</TableCell>
              <TableCell>Product Discription</TableCell>
              <TableCell> <TableSortLabel
                  active={orderBy === 'productCategory'}
                  direction={orderBy === 'productCategory' ? order : 'asc'}
                  onClick={() => handleRequestSort('productCategory')}
                >
                  Product Category
                  {orderBy === 'productCategory' ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                    </Box>
                  ) : null}
                </TableSortLabel></TableCell>
              <TableCell>Product Status</TableCell>
              <TableCell>Product Image</TableCell>
              <TableCell align='right'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.productPrice}</TableCell>
                <TableCell>{product.productDescription}</TableCell>
                <TableCell>{getCategoryName(product.productCategory)}</TableCell>
                <TableCell>{product.productStatus}</TableCell>
                <TableCell>
                  {product.productImage && (
                    <img
                    src={`http://localhost:5000/images/${product.productImage}`}
                    alt={product.productName}
                      width="50"
                      height="50"
                    />
                  )}
                </TableCell>
                <TableCell align='right'>
                  <Button onClick={() => handleEditProduct(product)}>
                    <EditIcon style={{color:'blue'}}/>
                  </Button>
                  <Button  onClick={() => handleDeleteProduct(product._id)}>
                    <DeleteIcon style={{color:'red'}}/>
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
