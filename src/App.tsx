import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './core/layout';
import LoginPage from './pages/LoginPage';
import CategoriesPage from './pages/CategoriesPage';
import AuthorsPage from './pages/AuthorsPage';
import DevelopersPage from './pages/DevelopersPage';
import { isAuthenticated } from './core/api/auth';
import './App.css';
import { LanguageProvider } from './core/context/LanguageContext';
import CreateCategoryPage from './pages/CreateCategoryPage';
import CreateAuthorPage from './pages/CreateAuthorPage';
import CreateDeveloperPage from './pages/CreateDeveloperPage';
import EditCategoryPage from './pages/EditCategoryPage';
import EditAuthorPage from './pages/EditAuthorPage';
import EditDeveloperPage from './pages/EditDeveloperPage';

const queryClient = new QueryClient();

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <Layout>
                  <Routes>
                    <Route path="/categories" element={<CategoriesPage />} />
                    <Route path="/authors" element={<AuthorsPage />} />
                    <Route path="/developers" element={<DevelopersPage  />} />
                    <Route path="/categories/create" element={<CreateCategoryPage />} />
                    <Route path="/authors/create" element={<CreateAuthorPage />} />
                    <Route path="/developers/create" element={<CreateDeveloperPage />} />
                    <Route path="/categories/:id" element={<EditCategoryPage />} />
                    <Route path="/authors/edit/:id" element={<EditAuthorPage />} />
                    <Route path="/developers/edit/:id" element={<EditDeveloperPage />} />
                    <Route path="/" element={<Navigate to="/categories" />} />
                  </Routes>
                </Layout>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
      </LanguageProvider>
    </QueryClientProvider>
  )
}

export default App
