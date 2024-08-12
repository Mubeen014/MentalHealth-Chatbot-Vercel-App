'use client'
import React from 'react';
import Link from 'next/link';
import { Container, Typography, Button, Box, Paper, CssBaseline } from '@mui/material';
import { styled } from '@mui/material/styles';

const GradientBackground = styled('div')(({ theme }) => ({
  background: 'linear-gradient(to right, #FF7E5F, #FF9A8B)',
  padding: theme.spacing(6),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[5],
  textAlign: 'center',
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  fontSize: '1.1rem',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[3],
  '&:hover': {
    backgroundColor: theme.palette.primary.dark,
    boxShadow: theme.shadows[6],
  },
}));

const HomePage = () => {
  return (
    <>
      <CssBaseline />
      <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 4 }}>
        <GradientBackground>
          <Typography variant="h3" component="h1" color="common.white" gutterBottom>
            Welcome to Your Mental Health Support
          </Typography>
          <Typography variant="body1" color="common.white" paragraph>
            We are here to provide support and guidance. Take the first step towards a better day by exploring our resources.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
            <Link href="/Hello" passHref>
            </Link>
            <Link href="/Signup" passHref>
              <StyledButton variant="contained" color="secondary">
                Sign Up
              </StyledButton>
            </Link>
            <Link href="/Signin" passHref>
              <StyledButton variant="contained" color="secondary">
                Sign In
              </StyledButton>
            </Link>
          </Box>
        </GradientBackground>
      </Container>
    </>
  );
};

export default HomePage;
