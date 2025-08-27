import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { LoadingProvider, useLoading } from './context/Loading';
import { AuthProvider } from './context/Authentication';
import { Provider } from 'react-redux';
import { router } from './routes';
import LoadingSpinner from './components/LoadingSpinner';
import { RouterProvider } from 'react-router-dom';
import { store } from './redux/store';

const AppWrapper = () => {
  const { loading } = useLoading();
  return (
    <>
      {loading && <LoadingSpinner />}
      <RouterProvider router={router} />
    </>
  );
};
const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <Provider store={store}>
        <LoadingProvider>
          <AuthProvider>
            <AppWrapper />
          </AuthProvider>
        </LoadingProvider>
      </Provider>
    </StrictMode>
  );
} else {
  console.error("Failed to find the root element");
}
