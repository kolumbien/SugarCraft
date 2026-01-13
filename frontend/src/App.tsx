import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ArticlesList from './pages/articles/List';
import CreateArticle from './pages/articles/Create';
import ArticleDetails from './pages/articles/Details';
import FactoriesList from './pages/factories/List';
import CreateFactory from './pages/factories/Create';
import FactoryDetails from './pages/factories/Details';
import ShopsList from './pages/shops/List';
import CreateShop from './pages/shops/Create';
import ShopDetails from './pages/shops/Details';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />

              {/* Articles */}
              <Route path="articles" element={<ArticlesList />} />
              <Route path="articles/new" element={<CreateArticle />} />
              <Route path="articles/:id" element={<ArticleDetails />} />

              {/* Factories */}
              <Route path="factories" element={<FactoriesList />} />
              <Route path="factories/new" element={<CreateFactory />} />
              <Route path="factories/:id" element={<FactoryDetails />} />

              {/* Shops */}
              <Route path="shops" element={<ShopsList />} />
              <Route path="shops/new" element={<CreateShop />} />
              <Route path="shops/:id" element={<ShopDetails />} />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
