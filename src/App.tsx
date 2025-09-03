import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./core/layout";
import LoginPage from "./pages/LoginPage";
import CategoriesPage from "./pages/CategoriesPage";
import AuthorsPage from "./pages/AuthorsPage";
import DevelopersPage from "./pages/DevelopersPage";
import BooksPage from "./pages/BooksPage";
import { isAuthenticated } from "./core/api/auth";
import "./App.css";
import { LanguageProvider } from "./core/context/LanguageContext";
import CreateCategoryPage from "./pages/CreateCategoryPage";
import CreateAuthorPage from "./pages/CreateAuthorPage";
import CreateDeveloperPage from "./pages/CreateDeveloperPage";
import CreateBookPage from "./pages/CreateFolklorPage";
import CreateBooksPage from "./pages/CreateBooksPage";
import EditCategoryPage from "./pages/EditCategoryPage";
import EditAuthorPage from "./pages/EditAuthorPage";
import EditDeveloperPage from "./pages/EditDeveloperPage";
import EditBookPage from "./pages/EditFolklorsPage";
import EditBooksPage from "./pages/EditBooksPage";
import FolklorsPage from "./pages/FolklorsPage";
import MultiSelectTestPage from "./pages/MultiSelectTestPage";

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
                      <Route path="/developers" element={<DevelopersPage />} />
                      <Route path="/folklors" element={<FolklorsPage />} />
                      <Route path="/books" element={<BooksPage />} />
                      <Route
                        path="/categories/create"
                        element={<CreateCategoryPage />}
                      />
                      <Route
                        path="/authors/create"
                        element={<CreateAuthorPage />}
                      />
                      <Route
                        path="/developers/create"
                        element={<CreateDeveloperPage />}
                      />
                      <Route
                        path="/folklors/create"
                        element={<CreateBookPage />}
                      />
                      <Route
                        path="/books/create"
                        element={<CreateBooksPage />}
                      />
                      <Route
                        path="/categories/edit/:id"
                        element={<EditCategoryPage />}
                      />
                      <Route
                        path="/authors/edit/:id"
                        element={<EditAuthorPage />}
                      />
                      <Route
                        path="/developers/edit/:id"
                        element={<EditDeveloperPage />}
                      />
                      <Route
                        path="/folklors/edit/:id"
                        element={<EditBookPage />}
                      />
                      <Route
                        path="/books/edit/:id"
                        element={<EditBooksPage />}
                      />
                      <Route
                        path="/multiselect-test"
                        element={<MultiSelectTestPage />}
                      />
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
  );
}

export default App;
