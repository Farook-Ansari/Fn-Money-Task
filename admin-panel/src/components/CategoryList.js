import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  TextField,
  Grid,
  TableContainer,
  IconButton,
  TableSortLabel,
  Box,
} from '@mui/material';
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

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('categoryName');
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    categoryDescription: '',
    categoryImage: null, 
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/categories');
      setCategories(response.data.categories);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleAddCategory = async () => {
    if (!newCategory.categoryName) {
      console.error('Category Name is required');
      return;
    }

    const formData = new FormData();
    formData.append('categoryName', newCategory.categoryName);
    formData.append('categoryDescription', newCategory.categoryDescription);
    if (newCategory.categoryImage) {
      formData.append('categoryImage', newCategory.categoryImage); 
    }

    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/categories/${editCategoryId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      } else {
        await axios.post('http://localhost:5000/categories', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      setNewCategory({
        categoryName: '',
        categoryDescription: '',
        categoryImage: null,
      });
      fetchCategories();
      setShowAddForm(false);
      setIsEditing(false);
    } catch (err) {
      console.error('Error adding/updating category:', err);
    }
  };

  const handleEditCategory = (category) => {
    setNewCategory({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription,
      categoryImage: null, 
    });
    setEditCategoryId(category._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/categories/${id}`);
      console.log("Category deleted successfully:", response.data);
    } catch (err) {
      console.error("Error deleting category:", err.response || err);
    }
  };
  

  const visibleCategories = [...categories].sort(getComparator(order, orderBy));

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
      color: 'black',
    },
    addButton: {
      backgroundColor: '#4caf50',
      color: '#fff',
      marginRight: '10px',
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
          Category List
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setIsEditing(false);
            setNewCategory({
              categoryName: '',
              categoryDescription: '',
              categoryImage: null,
            });
          }}
          style={{ marginBottom: '20px', marginLeft:'900px', marginTop:'-70px'}}        >
          {showAddForm ? 'Hide Add Category Form' : 'Add New Category'}
        </Button>

        {showAddForm && (
          <div style={styles.modal}>
            <div style={styles.modalContent}>
              <Typography variant="h5" gutterBottom>
                {isEditing ? 'Edit Category' : 'Add New Category'}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    label="Category Name"
                    fullWidth
                    value={newCategory.categoryName}
                    onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
                    style={styles.inputField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    fullWidth
                    value={newCategory.categoryDescription}
                    onChange={(e) => setNewCategory({ ...newCategory, categoryDescription: e.target.value })}
                    style={styles.inputField}
                  />
                </Grid>
                <Grid item xs={12}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setNewCategory({ ...newCategory, categoryImage: e.target.files[0] })}
                    style={{ marginBottom: '10px' }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleAddCategory}
                    style={styles.addButton}
                  >
                    {isEditing ? 'Update Category' : 'Add Category'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => setShowAddForm(false)}
                    style={styles.closeButton}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        )}

        <TableContainer component={Paper}>
          <Table aria-label="category table">
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'categoryName'}
                    direction={orderBy === 'categoryName' ? order : 'asc'}
                    onClick={() => handleRequestSort('categoryName')}
                  >
                    Category Name
                    {orderBy === 'categoryName' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'categoryDescription'}
                    direction={orderBy === 'categoryDescription' ? order : 'asc'}
                    onClick={() => handleRequestSort('categoryDescription')}
                  >
                    Description
                    {orderBy === 'categoryDescription' ? (
                      <Box component="span" sx={visuallyHidden}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                </TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {visibleCategories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell>{category.categoryDescription}</TableCell>
                  <TableCell>
                    {category.categoryImage && (
                     <img
                     src={`http://localhost:5000/images/${category.categoryImage}`}
                     alt={category.categoryName}
                     width="50"
                     height="50"
                   />                            
                    )}
                  </TableCell>
                  <TableCell>
                    <IconButton
                      onClick={() => handleEditCategory(category)}
                    >
                      <EditIcon style={{color:'blue'}}/>
                    </IconButton>
                    <IconButton
                      onClick={() => handleDeleteCategory(category._id)}
                    >
                      <DeleteIcon style={{color:'red'}} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default CategoryList;
