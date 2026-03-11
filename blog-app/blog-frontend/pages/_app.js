import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Component {...pageProps} />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: '14px',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
