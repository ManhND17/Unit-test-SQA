import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './styles/main.scss';
import { QueryClientProvider } from '@tanstack/react-query';
import store, { persistor } from './redux/store'; // , { persistor }
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import App from './App.tsx';
import { createTheme, ThemeProvider } from '@mui/material';
import { queryClient } from './config/queryClient.ts';
import LoadingScreen from '@components/LoadingScreen/index.tsx';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';

const theme = createTheme({
  components: {
    MuiInput: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          border: '1px solid #d1d5db',
          '&:hover': {
            borderColor: '#2563eb',
          },
          '&.Mui-focused': {
            borderColor: '#2563eb',
          },
        },
        input: {
          padding: '10px',
        },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={<LoadingScreen />} persistor={persistor}>
            <Suspense fallback={<LoadingScreen />}>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </Suspense>
          </PersistGate>
        </Provider>
      </QueryClientProvider>
      <ToastContainer
        position="top-right"
        draggable
        pauseOnFocusLoss
        autoClose={3000}
        hideProgressBar
        newestOnTop
        pauseOnHover
      />
    </ThemeProvider>
  </StrictMode>
);
