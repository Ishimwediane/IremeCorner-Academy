import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Don't retry on 401/403 errors (authentication issues)
        if (error?.response?.status === 401 || error?.response?.status === 403) {
          return false;
        }
        // Retry other errors once
        return failureCount < 1;
      },
      retryDelay: 1000,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      fontSize: '3rem',
      lineHeight: 1.2,
    },
    h2: {
      fontWeight: 800,
      fontSize: '2.5rem',
      lineHeight: 1.2,
    },
    h3: {
      fontWeight: 700,
      fontSize: '2rem',
      lineHeight: 1.3,
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.4,
    },
    h5: {
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 700,
      fontSize: '1.1rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.7,
      color: '#666',
    },
    body2: {
      fontSize: '0.95rem',
      lineHeight: 1.7,
      color: '#666',
    },
  },
  palette: {
    primary: {
      main: '#FD7E14',
      light: '#FE9A4D',
      dark: '#E56D0F',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#FAF1E6',
      light: '#FFFFFF',
      dark: '#E8D9C8',
      contrastText: '#1A1A1A',
    },
    text: {
      primary: '#1A1A1A',
      secondary: '#666',
    },
    background: {
      default: '#FFFFFF',
      paper: '#FFFFFF',
    },
    success: {
      main: '#FD7E14',
      light: '#FE9A4D',
      dark: '#E56D0F',
    },
    error: {
      main: '#FD7E14',
      light: '#FE9A4D',
      dark: '#E56D0F',
    },
    warning: {
      main: '#FD7E14',
      light: '#FE9A4D',
      dark: '#E56D0F',
    },
    info: {
      main: '#FD7E14',
      light: '#FE9A4D',
      dark: '#E56D0F',
    },
  },
  spacing: 8,
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: '24px',
          paddingRight: '24px',
          '@media (min-width: 600px)': {
            paddingLeft: '32px',
            paddingRight: '32px',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
          borderRadius: '50px',
          padding: '12px 32px',
          fontSize: '1rem',
          '&.MuiButton-contained': {
            backgroundColor: '#FD7E14',
            boxShadow: '0 4px 14px rgba(253, 126, 20, 0.3)',
            '&:hover': {
              backgroundColor: '#E56D0F',
              boxShadow: '0 6px 20px rgba(253, 126, 20, 0.4)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.3s',
          },
          '&.MuiButton-outlined': {
            borderWidth: '2px',
            borderColor: '#FD7E14',
            color: '#FD7E14',
            '&:hover': {
              borderWidth: '2px',
              backgroundColor: 'rgba(253, 126, 20, 0.05)',
            },
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '12px',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FD7E14',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#FD7E14',
            },
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: '#FD7E14',
          },
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);













