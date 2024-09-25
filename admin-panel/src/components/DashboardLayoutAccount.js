import * as React from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useNavigate, Routes, Route } from 'react-router-dom';
import ProductList from './ProductList';  
import CategoryList from './CategoryList';  
import { List, ListItem, ListItemIcon, ListItemText, Box, Typography } from '@mui/material'; 
import Login from '../auth/Login'; 

const NAVIGATION = [
  {
    segment: 'productlist',
    title: 'Product List',
    icon: <DashboardIcon />,
    path: '/dashboard/productlist', 
  },
  {
    segment: 'categories',
    title: 'Categories',
    icon: <DashboardIcon />,
    path: '/dashboard/categories', 
  },
];

function DashboardLayoutAccount(props) {
  const { window } = props;
  const navigate = useNavigate();
  
  const [session, setSession] = React.useState(null);

  const authentication = React.useMemo(() => ({
    signIn: (token) => {
      setSession(token);
      navigate('/dashboard/productlist');
    },
    signOut: () => {
      setSession(null);  
    },
  }), [navigate]);

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      window={window}
    >
      <DashboardLayout>
        {session ? ( 
          <>
            <Box sx={{ width: '250px', bgcolor: 'background.paper', color: 'text.primary', borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
              <List sx={{ padding: '0' }}>
                {NAVIGATION.map((item) => (
                  <ListItem 
                    button 
                    key={item.segment} 
                    onClick={() => navigate(item.path)} 
                    sx={{ 
                      '&:hover': { bgcolor: 'grey.200' },
                      '&.Mui-selected': { bgcolor: 'grey.300' },
                    }}
                  >
                    <ListItemIcon sx={{ color: 'text.primary' }}>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.title} />
                  </ListItem>
                ))}
              </List>
            </Box>

            <Routes>
              <Route path="/dashboard/productlist" element={<ProductList />} />
              <Route path="/dashboard/categories" element={<CategoryList />} />
            </Routes>
          </>
        ) : (
          <Login onSignIn={authentication.signIn} />
        )}
      </DashboardLayout>
      
    </AppProvider>
  );
}

DashboardLayoutAccount.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutAccount;
