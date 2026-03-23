import { Routes, Route, Navigate } from 'react-router-dom';
import Storefront from './pages/Storefront';
import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import DashboardView from './pages/admin/DashboardView';
import ProductsView from './pages/admin/ProductsView';
import SettingsView from './pages/admin/SettingsView';
import OrdersView from './pages/admin/OrdersView';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Storefront />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardView />} />
        <Route path="orders" element={<OrdersView />} />
        <Route path="products" element={<ProductsView />} />
        <Route path="settings" element={<SettingsView />} />
      </Route>
    </Routes>
  );
}
