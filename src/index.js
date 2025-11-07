import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import './index.css';

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
  palette: {
    primary: {
      main: '#202F32',
      light: '#2d3f43',
      dark: '#151f21',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#C39766',
      light: '#b86d5a',
      dark: '#7d3328',
      contrastText: '#ffffff',
    },
    // Remove other colors - use only primary and secondary
    success: {
      main: '#C39766',
      light: '#b86d5a',
      dark: '#7d3328',
    },
    error: {
      main: '#C39766',
      light: '#b86d5a',
      dark: '#7d3328',
    },
    warning: {
      main: '#C39766',
      light: '#b86d5a',
      dark: '#7d3328',
    },
    info: {
      main: '#202F32',
      light: '#2d3f43',
      dark: '#151f21',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          '&.MuiButton-contained': {
            backgroundColor: '#C39766',
            '&:hover': {
              backgroundColor: '#7d3328',
            },
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








