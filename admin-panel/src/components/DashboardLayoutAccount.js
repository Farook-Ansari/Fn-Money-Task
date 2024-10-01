import * as React from 'react';
import PropTypes from 'prop-types';
import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppProvider } from '@toolpad/core/AppProvider';
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom';
import ProductList from './ProductList';
import CategoryList from './CategoryList';
import { List, ListItem, ListItemIcon, ListItemText, Box } from '@mui/material';
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

  const authentication = React.useMemo(
    () => ({
      signIn: (token) => {
        setSession(token);  
        navigate('/dashboard/productlist'); 
      },
      signOut: () => {
        setSession(null);  // Clear session
        navigate('/login'); // Redirect to login page
      },
    }),
    [navigate]
  );

  return (
    <AppProvider
      session={session}
      authentication={authentication}
      navigation={NAVIGATION}
      window={window}
    >
      <div className='nav' style={{display:'flex', borderBottom:'2px solid rgba(0, 0, 0, 0.12)'}}>
        <h1 style={{marginRight:'30cm', marginLeft:'3cm'}}>Toolkit</h1>
        <button 
          style={{width:'80px', height:'35px', marginTop:'30px', backgroundColor: '#3378bc', color: 'white', borderRadius:'10px'}}
          onClick={authentication.signOut}
        >
          Sign Out
        </button>
      </div>
      
      {session ? (  
        <>
          <Box
            sx={{
              width: '250px',
              height: '100vh', 
              bgcolor: 'background.paper',
              color: 'text.primary',
              borderRight: '2px solid rgba(0, 0, 0, 0.12)',
            }}
          >
            <List sx={{ padding: '0' }}>
              {NAVIGATION.map((item) => (
                <ListItem
                  button
                  component={NavLink}  
                  to={item.path}  
                  key={item.segment}
                  sx={{
                    color: 'black',
                    '&:hover': { color: 'grey.400' },
                    '&.active': { color: 'blue' },  
                  }}
                >
                  <ListItemIcon sx={{ color: 'text.primary' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.title} />
                </ListItem>
              ))}
            </List>
          </Box>

          <Box sx={{ marginLeft: '255px', padding: '16px', marginTop: '-19cm' }}>
            <Routes>
              <Route path="/dashboard/productlist" element={<ProductList />} />
              <Route path="/dashboard/categories" element={<CategoryList />} />
            </Routes>
          </Box>
        </>
      ) : (
        <Login onSignIn={authentication.signIn} />
      )}
    </AppProvider>
  );
}

DashboardLayoutAccount.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutAccount;
