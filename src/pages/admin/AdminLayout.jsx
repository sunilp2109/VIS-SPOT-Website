import { useEffect } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Package, Settings, LogOut } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
    }
    document.body.style.cursor = 'auto'; // ensure pointer reset internally
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Orders Logistics', path: '/admin/orders', icon: <ShoppingBag size={20} /> },
    { name: 'Inventory & Stock', path: '/admin/products', icon: <Package size={20} /> },
    { name: 'Aesthetics', path: '/admin/settings', icon: <Settings size={20} /> }
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', fontFamily: 'Inter, sans-serif' }}>
      
      <aside style={{ width: '280px', background: '#0a0a0a', color: 'white', padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column', boxShadow: '5px 0 20px rgba(0,0,0,0.1)' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '3.5rem', letterSpacing: '2px', textAlign: 'center', fontWeight:'600' }}>VIS SPOT</h2>
        
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map(item => {
            const isActive = location.pathname.includes(item.path);
            return (
              <Link 
                key={item.name} 
                to={item.path} 
                style={{
                  display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 20px',
                  borderRadius: '8px', textDecoration: 'none', transition: 'all 0.2s ease',
                  background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: isActive ? 'white' : '#888',
                  fontWeight: isActive ? '500' : '400'
                }}
              >
                {item.icon}
                {item.name}
              </Link>
            )
          })}
        </nav>

        <a href="/" target="_blank" style={{ color: '#aaa', textDecoration: 'none', textAlign: 'center', margin: '2rem 0', fontSize: '0.9rem', display: 'flex', justifyContent: 'center', padding: '14px', border: '1px solid #333', borderRadius: '8px', transition: 'background 0.2s' }}>
          View Live Store
        </a>

        <button 
          onClick={handleLogout} 
          style={{ display: 'flex', alignItems: 'center', justifyContent:'center', gap: '12px', padding: '14px', background: 'rgba(255,0,0,0.1)', border: 'none', color: '#ff4d4d', cursor: 'pointer', borderRadius: '8px', fontWeight:'500', transition:'opacity 0.2s' }}
        >
          <LogOut size={20} /> Logout System
        </button>
      </aside>

      <main style={{ flex: 1, padding: '3.5rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}
