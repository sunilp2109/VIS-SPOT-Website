import { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2 } from 'lucide-react';

export default function ProductsView() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', category: 'bracelet', desc: '', stock: '' });
  const [customCategory, setCustomCategory] = useState('');
  const [img, setImg] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/data');
    setProducts(res.data.products);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('adminToken');
    const formData = new FormData();
    Object.keys(form).forEach(k => {
      if (k === 'category' && form.category === 'other') {
        formData.append('category', customCategory);
      } else {
        formData.append(k, form[k]);
      }
    });
    if(img) formData.append('image', img);

    await axios.post('http://localhost:5000/api/products', formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setForm({ name: '', price: '', category: 'bracelet', desc: '', stock: '' });
    setCustomCategory('');
    setImg(null);
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if(!window.confirm("Delete this product permanently?")) return;
    const token = localStorage.getItem('adminToken');
    await axios.delete(`http://localhost:5000/api/products/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchProducts();
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2.5rem', fontWeight:'600' }}>Catalog & Inventory</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem' }}>
        
        {/* Inventory Active List */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '2rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', fontWeight:'500' }}>Active Listings</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #eee', color: '#666' }}>
                <th style={{ padding: '0 0 12px', fontWeight:'500', fontSize:'0.9rem' }}>Product</th>
                <th style={{ padding: '0 0 12px', fontWeight:'500', fontSize:'0.9rem' }}>Category</th>
                <th style={{ padding: '0 0 12px', fontWeight:'500', fontSize:'0.9rem' }}>Price</th>
                <th style={{ padding: '0 0 12px', fontWeight:'500', fontSize:'0.9rem' }}>In Stock</th>
                <th style={{ padding: '0 0 12px', textAlign: 'right', fontWeight:'500', fontSize:'0.9rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <img src={p.img} style={{ width:'45px', height:'45px', objectFit:'cover', borderRadius:'6px' }} />
                    <span style={{ fontWeight: '500', fontSize:'0.95rem' }}>{p.name}</span>
                  </td>
                  <td style={{ padding: '16px 0', textTransform: 'capitalize', color: '#666', fontSize:'0.9rem' }}>{p.category}</td>
                  <td style={{ padding: '16px 0', fontWeight:'500' }}>₹{Number(p.price).toLocaleString('en-IN')}</td>
                  <td style={{ padding: '16px 0' }}>
                    <span style={{ background: p.stock < 5 ? '#FFEBEE' : '#E8F5E9', color: p.stock < 5 ? '#C62828' : '#2E7D32', padding: '6px 12px', borderRadius: '6px', fontSize: '0.85rem', fontWeight: '600' }}>
                      {p.stock} units
                    </span>
                  </td>
                  <td style={{ padding: '16px 0', textAlign: 'right' }}>
                    <button onClick={() => handleDelete(p.id)} style={{ background: 'transparent', border: 'none', color: '#ff4d4d', cursor: 'pointer', padding: '6px', opacity: 0.8 }}><Trash2 size={20} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Catalog Add Module */}
        <div style={{ background: '#111', color: 'white', borderRadius: '16px', padding: '2rem', height: 'fit-content', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '10px', fontWeight:'500' }}><Plus size={20}/> New Product Form</h2>
          <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            
            <input placeholder="Product Title" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required style={{ padding: '14px', background: '#222', border: '1px solid #333', color: 'white', borderRadius: '8px', fontSize:'0.95rem' }}/>
            
            <div style={{display: 'flex', gap: '1rem', width: '100%'}}>
              <input type="number" placeholder="Price (INR)" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required style={{ padding: '14px', background: '#222', border: '1px solid #333', color: 'white', borderRadius: '8px', flex: 1, minWidth: 0, boxSizing: 'border-box', fontSize:'0.95rem' }}/>
              <input type="number" placeholder="Stock Qty" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required style={{ padding: '14px', background: '#222', border: '1px solid #333', color: 'white', borderRadius: '8px', flex: 1, minWidth: 0, boxSizing: 'border-box', fontSize:'0.95rem' }}/>
            </div>
            
            <div style={{display: 'flex', gap: '1rem', width: '100%'}}>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} style={{ flex: form.category === 'other' ? 1 : '100%', padding: '14px', background: '#222', border: '1px solid #333', color: 'white', borderRadius: '8px', fontSize:'0.95rem' }}>
                <option value="bracelet">Bracelet</option>
                <option value="charm">Phone Charm</option>
                <option value="keychain">Keychain</option>
                <option value="other">Other</option>
              </select>
              {form.category === 'other' && (
                <input 
                  type="text" 
                  placeholder="Custom Category" 
                  value={customCategory} 
                  onChange={e => setCustomCategory(e.target.value)}
                  required 
                  style={{ flex: 1.5, padding: '14px', background: '#222', border: '1px solid #333', color: 'white', borderRadius: '8px', minWidth: 0, boxSizing: 'border-box', fontSize:'0.95rem' }}
                />
              )}
            </div>
            
            <textarea placeholder="Detailed Description..." value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} required style={{ padding: '14px', background: '#222', border: '1px solid #333', color: 'white', borderRadius: '8px', minHeight: '100px', fontFamily: 'inherit', fontSize:'0.95rem', resize:'vertical' }}></textarea>
            
            <div style={{ background: '#222', padding: '1rem', borderRadius: '8px', border: '1px dashed #444' }}>
              <label style={{ fontSize: '0.85rem', color: '#aaa', display:'block', marginBottom:'0.5rem' }}>High Quality Image</label>
              <input type="file" accept="image/*" onChange={e => setImg(e.target.files[0])} style={{ color: '#aaa', fontSize:'0.85rem' }} />
            </div>
            
            <button type="submit" style={{ padding: '14px', background: 'white', color: 'black', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '1rem', fontSize:'1rem' }}>Publish Core Product</button>
          </form>
        </div>
      </div>
    </div>
  );
}
