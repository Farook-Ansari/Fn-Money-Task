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

const SignUpContainer = styled(Stack)(({ theme }) => ({
    padding: 20,
    marginTop: '10vh',
}));

const Register = () => {
    const [name, setName] = useState(''); // Add state for name
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!name || !email || !password) {
            setError('All fields are required');
            return;
        }

        console.log({ name, email, password }); // Log the values to verify

        try {
            const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
            console.log('Registration successful', response.data);
            navigate('/signin'); // Redirect to the login page
        } catch (err) {
            console.error(err.response?.data || 'An error occurred');
            setError('Registration failed');
        }
    };

    return (
        <SignUpContainer direction="column" justifyContent="center" alignItems="center">
            <CssBaseline />
            <StyledCard variant="outlined">
                <Typography component="h1" variant="h4" sx={{ textAlign: 'center' }}>
                    Sign Up
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleRegister}
                    noValidate
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        gap: 2,
                    }}
                >
                    <FormControl>
                        <FormLabel htmlFor="name">Name</FormLabel>
                        <TextField
                            id="name"
                            type="text"
                            name="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Your Name"
                            required
                            fullWidth
                            variant="outlined"
                            error={Boolean(error)}
                            helperText={error}
                        />
                    </FormControl>
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
                        Sign Up
                    </Button>
                    <Typography sx={{ textAlign: 'center' }}>
                        Already have an account?{' '}
                        <Link component={RouterLink} to="/signin" variant="body2">
                            Sign in
                        </Link>
                    </Typography>
                </Box>
            </StyledCard>
        </SignUpContainer>
    );
};

export default Register;
