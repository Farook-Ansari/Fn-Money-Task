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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    categoryDescription: '',
    categoryImageUrl: '',
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
      console.error(err);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.categoryName) {
      console.error('Category Name is required');
      return;
    }

    try {
      if (isEditing) {
        // Update existing category
        await axios.put(`http://localhost:5000/categories/${editCategoryId}`, newCategory);
      } else {
        // Add new category
        await axios.post('http://localhost:5000/categories', newCategory);
      }

      setNewCategory({
        categoryName: '',
        categoryDescription: '',
        categoryImageUrl: '',
      });
      fetchCategories();
      setShowAddForm(false);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditCategory = (category) => {
    setNewCategory({
      categoryName: category.categoryName,
      categoryDescription: category.categoryDescription,
      categoryImageUrl: category.categoryImageUrl,
    });
    setEditCategoryId(category._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:5000/categories/${categoryId}`);
      fetchCategories();
    } catch (err) {
      console.error(err);
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
              categoryImageUrl: '',
            });
          }}
          style={{ marginBottom: '20px' }}
        >
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
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    fullWidth
                    value={newCategory.categoryDescription}
                    onChange={(e) => setNewCategory({ ...newCategory, categoryDescription: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Image URL"
                    fullWidth
                    value={newCategory.categoryImageUrl}
                    onChange={(e) => setNewCategory({ ...newCategory, categoryImageUrl: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddCategory}
                    style={styles.addButton}
                  >
                    {isEditing ? 'Update Category' : 'Add Category'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    Close
                  </Button>
                </Grid>
              </Grid>
            </div>
          </div>
        )}

        {/* Category List Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category._id}>
                  <TableCell>{category.categoryName}</TableCell>
                  <TableCell>{category.categoryDescription}</TableCell>
                  <TableCell>
                    <img
                      src={category.categoryImageUrl}
                      alt={category.categoryName}
                      style={{ width: '50px', borderRadius: '4px' }}
                    />
                  </TableCell>
                  <TableCell>
                    <IconButton color="primary" onClick={() => handleEditCategory(category)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" onClick={() => handleDeleteCategory(category._id)}>
                      <DeleteIcon />
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
