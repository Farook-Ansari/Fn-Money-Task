import React, { useState } from 'react';
import axios from 'axios';
import { Box, Button, TextField, Typography, Stack, CssBaseline, Card, FormControl, FormLabel, Link } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

const StyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '450px',
  },
  boxShadow: 'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
  padding: 20,
  marginTop: '10vh',
}));

const Login = ({ onSignIn }) => { // Accept onSignIn as prop
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      console.log('Login successful');
      console.log('Token:', response.data.token);
      onSignIn(response.data.token); // Call onSignIn with the token
    } catch (err) {
      console.error(err.response?.data || 'An error occurred');
      setError('Invalid credentials');
    }
  };

  return (
    <SignInContainer direction="column" justifyContent="center" alignItems="center">
      <CssBaseline />
      <StyledCard variant="outlined">
        <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
          Sign In
        </Typography>
        <Box
          component="form"
          onSubmit={handleLogin}
          noValidate
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            gap: 2,
          }}
        >
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <TextField
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              autoFocus
              required
              fullWidth
              variant="outlined"
              error={Boolean(error)}
              helperText={error}
            />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor="password">Password</FormLabel>
            <TextField
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              autoComplete="current-password"
              required
              fullWidth
              variant="outlined"
              error={Boolean(error)}
              helperText={error}
            />
          </FormControl>
          <Button type="submit" fullWidth variant="contained" color="primary">
            Sign In
          </Button>
          <Typography sx={{ textAlign: 'center' }}>
            Don&apos;t have an account?{' '}
            <Link component={RouterLink} to="/signup" variant="body2">
              Sign up
            </Link>
          </Typography>
        </Box>
      </StyledCard>
    </SignInContainer>
  );
};

export default Login;
