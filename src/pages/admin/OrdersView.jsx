import { useState, useEffect } from 'react';
import axios from 'axios';
import { Package2, CheckCircle, Truck, Package } from 'lucide-react';

export default function OrdersView() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const token = localStorage.getItem('adminToken');
    try {
      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (id, newStatus) => {
    const token = localStorage.getItem('adminToken');
    await axios.patch(`http://localhost:5000/api/orders/${id}/status`, { status: newStatus }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchOrders(); 
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return { bg: '#FFF3E0', text: '#D32F2F' };
      case 'Confirmed': return { bg: '#E3F2FD', text: '#1565C0' };
      case 'Dispatched': return { bg: '#FFF8E1', text: '#F57C00' };
      case 'Delivered': return { bg: '#E8F5E9', text: '#2E7D32' };
      default: return { bg: '#eee', text: '#555' };
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2.5rem', fontWeight:'600', display:'flex', alignItems:'center', gap:'12px' }}>
        <Package2 size={28}/> Order Fulfillment
      </h1>

      <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #eee', color: '#666' }}>
              <th style={{ padding: '0 0 16px', fontSize:'0.9rem', fontWeight:'500' }}>Order Hash / Timeline</th>
              <th style={{ padding: '0 0 16px', fontSize:'0.9rem', fontWeight:'500' }}>Assigned Customer</th>
              <th style={{ padding: '0 0 16px', fontSize:'0.9rem', fontWeight:'500' }}>Itemized Registry</th>
              <th style={{ padding: '0 0 16px', fontSize:'0.9rem', fontWeight:'500' }}>Revenue Capture</th>
              <th style={{ padding: '0 0 16px', fontSize:'0.9rem', fontWeight:'500' }}>Tracking Stage</th>
              <th style={{ padding: '0 0 16px', fontSize:'0.9rem', fontWeight:'500', textAlign:'right' }}>Action Vectors</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => {
              const statusStyle = getStatusColor(order.status);
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '20px 0', verticalAlign:'top' }}>
                    <div style={{ fontWeight:'600', color:'#111', fontSize:'0.95rem' }}>#{order.id.toString().slice(-8)}</div>
                    <div style={{ fontSize:'0.8rem', color:'#888', marginTop:'4px' }}>{new Date(order.date).toLocaleString()}</div>
                  </td>
                  <td style={{ padding: '20px 0', fontSize: '0.95rem', verticalAlign:'top' }}>{order.customer}</td>
                  <td style={{ padding: '20px 0', verticalAlign:'top' }}>
                    <ul style={{ margin:0, paddingLeft:'1.2rem', color:'#555', fontSize:'0.85rem', display:'flex', flexDirection:'column', gap:'4px' }}>
                      {order.items?.map((i, idx) => (
                        <li key={idx}><span style={{fontWeight:'600'}}>{i.qty}x</span> {i.name}</li>
                      ))}
                    </ul>
                  </td>
                  <td style={{ padding: '20px 0', fontWeight: '600', verticalAlign:'top', fontSize:'1.05rem' }}>₹{order.total.toLocaleString('en-IN')}</td>
                  <td style={{ padding: '20px 0', verticalAlign:'top' }}>
                    <span style={{ background: statusStyle.bg, color: statusStyle.text, border:`1px solid ${statusStyle.text}33`, padding: '6px 12px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', display:'inline-block' }}>
                      {order.status || 'Pending'}
                    </span>
                  </td>
                  <td style={{ padding: '20px 0', textAlign: 'right', verticalAlign:'top' }}>
                    
                    <div style={{ display:'flex', gap:'8px', justifyContent:'flex-end' }}>
                      <button 
                        onClick={() => updateStatus(order.id, 'Confirmed')} 
                        title="Mark as Confirmed" 
                        style={{ cursor:'pointer', background: order.status === 'Confirmed' ? '#E3F2FD' : 'white', border:'1px solid #ddd', padding:'8px', borderRadius:'6px', transition:'0.2s' }}>
                          <CheckCircle size={18} color={order.status === 'Confirmed' ? '#1565C0' : '#888'} />
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, 'Dispatched')} 
                        title="Mark as Dispatched Mode" 
                        style={{ cursor:'pointer', background: order.status === 'Dispatched' ? '#FFF8E1' : 'white', border:'1px solid #ddd', padding:'8px', borderRadius:'6px', transition:'0.2s' }}>
                          <Truck size={18} color={order.status === 'Dispatched' ? '#F57C00' : '#888'} />
                      </button>
                      <button 
                        onClick={() => updateStatus(order.id, 'Delivered')} 
                        title="Deploy Final Arrival Flag" 
                        style={{ cursor:'pointer', background: order.status === 'Delivered' ? '#E8F5E9' : 'white', border:'1px solid #ddd', padding:'8px', borderRadius:'6px', transition:'0.2s' }}>
                          <Package size={18} color={order.status === 'Delivered' ? '#2E7D32' : '#888'} />
                      </button>
                    </div>

                  </td>
                </tr>
              );
            })}
            {orders.length === 0 && (
              <tr><td colSpan="6" style={{padding:'40px 0', textAlign:'center', color:'#888'}}>No order lifecycle structures recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
