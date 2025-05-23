import Navbar from '../components/Navbar';
import '../styles/globals.css';
import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { LoadingProvider } from '../context/LoadingContext';
import { useLoading } from '../context/LoadingContext';
import { ThemeProvider } from '../context/ThemeContext';
import LoadingPage from '../components/LoadingPage';

function MyApp({ Component, pageProps }: AppProps) {
  const { isLoading } = useLoading();
  const [showLoadingPage, setShowLoadingPage] = useState(true);

  const handleEnter = () => {
    setShowLoadingPage(false);
  };

  return (
    <ThemeProvider>
      <LoadingProvider>
        {showLoadingPage ? (
          <LoadingPage onEnter={handleEnter} />
        ) : (
          <MainApp Component={Component} pageProps={pageProps} />
        )}
      </LoadingProvider>
    </ThemeProvider>
  );
}

function MainApp({ Component, pageProps }) {
  const router = useRouter();
  const { setIsLoading } = useLoading();

  useEffect(() => {
    const handleWindowLoad = () => setIsLoading(true);
    window.addEventListener('load', handleWindowLoad);

    return () => {
      window.removeEventListener('load', handleWindowLoad);
    };
  }, []);

  useEffect(() => {
    // Initial page load
    const handleWindowLoad = () => setIsLoading(false);
    if (document.readyState === 'complete') {
      setIsLoading(false);
    } else {
      window.addEventListener('load', handleWindowLoad);
    }

    // Route changes
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      window.removeEventListener('load', handleWindowLoad);
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router, setIsLoading]);

  useEffect(() => {
    setIsLoading(true); // Ensure loading starts as true

    const timeout = setTimeout(() => {
      setIsLoading(false); // Set loading to false after 1 minute
    }, 60000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Navbar />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;