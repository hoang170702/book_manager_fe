import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import AdminLayout from '../layouts/AdminLayout';
import HomePage from '../pages/user/HomePage';
import BookListPage from '../pages/user/BookListPage';
import BookDetailPage from '../pages/user/BookDetailPage';
import CartPage from '../pages/user/CartPage';
import CheckoutPage from '../pages/user/CheckoutPage';
import LoginPage from '../pages/user/LoginPage';
import DashboardPage from '../pages/admin/DashboardPage';
import ManageBooksPage from '../pages/admin/ManageBooksPage';
import ManageAuthorsPage from '../pages/admin/ManageAuthorsPage';
import ManageCategoriesPage from '../pages/admin/ManageCategoriesPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/books" element={<BookListPage />} />
          <Route path="/books/:id" element={<BookDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
        </Route>

        {/* Login (no layout) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Routes (protected) */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/books" element={<ManageBooksPage />} />
          <Route path="/admin/authors" element={<ManageAuthorsPage />} />
          <Route path="/admin/categories" element={<ManageCategoriesPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
