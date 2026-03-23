import { useState, useEffect } from 'react';
import axios from 'axios';
import { DollarSign, ShoppingBag, AlertTriangle, TrendingUp, LayoutDashboard } from 'lucide-react';

export default function DashboardView() {
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, lowStockAlerts: 0, recentOrders: [], topProducts: [], lowStockItems: [] });

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const res = await axios.get('http://localhost:5000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard backend validation failed");
      }
    };
    fetchDashboard();
  }, []);

  const MetricCard = ({ title, value, icon, color }) => (
    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ background: color, width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
        {icon}
      </div>
      <div>
        <h3 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.3rem', fontWeight:'500' }}>{title}</h3>
        <p style={{ fontSize: '1.8rem', fontWeight: '600', margin: 0, letterSpacing: '-0.02em' }}>{value}</p>
      </div>
    </div>
  );

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2.5rem', fontWeight:'600', display:'flex', alignItems:'center', gap:'12px' }}><LayoutDashboard size={28}/> Dashboard Analytics</h1>
      
      {/* Core Analytic Metric Array */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <MetricCard title="Total Gross Revenue" value={`₹${stats.totalRevenue.toLocaleString('en-IN')}`} icon={<DollarSign size={28}/>} color="#111" />
        <MetricCard title="Total Checkout Executions" value={stats.totalOrders} icon={<ShoppingBag size={28}/>} color="#4CAF50" />
        <MetricCard title="Restock Warning Deficits" value={stats.lowStockAlerts} icon={<AlertTriangle size={28}/>} color={stats.lowStockAlerts > 0 ? "#FF9800" : "#eee"} />
      </div>

      {/* Advanced Analytic Computation Row */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', marginBottom:'3rem' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight:'500', color:'#111', display:'flex', alignItems:'center', gap:'8px' }}><TrendingUp size={20}/> Most Sold Artifacts Matrix</h2>
          {stats.topProducts?.length > 0 ? (
            <ul style={{ listStyle:'none', padding:0, margin:0 }}>
              {stats.topProducts.map((p, i) => (
                <li key={i} style={{ display:'flex', justifyContent:'space-between', padding:'14px 0', borderBottom: i === stats.topProducts.length - 1 ? 'none' : '1px solid #f5f5f5', fontSize:'0.95rem' }}>
                  <span style={{fontWeight:'500', color:'#444'}}>{p.name}</span>
                  <span style={{background:'#f5f5f5', padding:'4px 10px', borderRadius:'12px', fontSize:'0.85rem', fontWeight:'600'}}>{p.qty} cumulative sold</span>
                </li>
              ))}
            </ul>
          ) : <p style={{color:'#888', fontSize:'0.9rem'}}>Algorithm unable to compute top structures natively.</p>}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight:'500', color:'#D32F2F', display:'flex', gap:'8px', alignItems:'center' }}><AlertTriangle size={20}/> Critical Supply Monitoring</h2>
          {stats.lowStockItems?.length > 0 ? (
            <ul style={{ listStyle:'none', padding:0, margin:0 }}>
              {stats.lowStockItems.map((p, i) => (
                <li key={i} style={{ display:'flex', justifyContent:'space-between', padding:'14px 0', borderBottom: i === stats.lowStockItems.length - 1 ? 'none' : '1px solid #f5f5f5', fontSize:'0.95rem' }}>
                  <span style={{fontWeight:'500', color:'#444'}}>{p.name}</span>
                  <span style={{color:'#D32F2F', fontWeight:'600', fontSize:'0.9rem', display:'flex', alignItems:'center', gap:'6px'}}><div style={{width:'8px', height:'8px', background:'#D32F2F', borderRadius:'50%'}}></div>{p.stock} internal capacity</span>
                </li>
              ))}
            </ul>
          ) : <p style={{color:'#2E7D32', fontSize:'0.9rem', fontWeight:'500', display:'flex', alignItems:'center', gap:'8px'}}><div style={{width:'10px', height:'10px', background:'#2E7D32', borderRadius:'50%'}}></div> All physical arrays are sufficiently stocked globally.</p>}
        </div>
      </div>
      
    </div>
  );
}


