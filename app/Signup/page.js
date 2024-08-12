'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Typography, TextField, Button, Box, Alert, Paper } from '@mui/material';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { styled } from '@mui/material/styles';

const GradientBackground = styled('div')(({ theme }) => ({
  background: 'linear-gradient(to right, #FFC3A0, #6A0572)',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  padding: theme.spacing(2),
}));

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  textAlign: 'center',
  width: '100%',
  maxWidth: 400,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[6],
  },
}));

const SignupPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.push('/userpage/Chatbot'); // Redirect to the chatbot page after sign up
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email already in use.');
      } else {
        console.error('Signup error:', error);
        setError('An error occurred during sign up. Please try again.');
      }
    }
  };

  return (
    <GradientBackground>
      <Container>
        <FormContainer elevation={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Sign Up
          </Typography>
          <form onSubmit={handleSignup} style={{ width: '100%' }}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <StyledButton type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
              Sign Up
            </StyledButton>
          </form>
          {error && (
            <Box sx={{ mt: 2 }}>
              <Alert 
                severity="error" 
                action={
                  error.includes('Email already in use') ? (
                    <Button variant= 'contained'color="inherit" onClick={() => router.push('/Signin')}>
                      Go to Login Page
                    </Button>
                  ) : null
                }
              >
                {error}
              </Alert>
            </Box>
          )}
        </FormContainer>
      </Container>
    </GradientBackground>
  );
};

export default SignupPage;
