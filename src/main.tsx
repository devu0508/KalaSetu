import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { store } from './store/store';
import { checkAuth } from './store/slices/authSlice';
import './index.css';
import App from './App';

// Check auth on app boot (restore session from httpOnly cookies)
store.dispatch(checkAuth());

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#402d26',
              color: '#fdf8f6',
              fontFamily: 'Lato, sans-serif',
              fontSize: '14px',
              borderRadius: '4px',
            },
            success: {
              iconTheme: {
                primary: '#d4af37',
                secondary: '#fdf8f6',
              },
            },
          }}
        />
      </BrowserRouter>
    </Provider>
  </StrictMode>
);
