import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Admin() {
  const [data, setData] = useState({ products: [], hero: {} });
  const [productForm, setProductForm] = useState({ name: '', price: '', category: 'bracelet', desc: '' });
  const [productImg, setProductImg] = useState(null);
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '' });
  const [heroImg, setHeroImg] = useState(null);

  const fetchData = () => {
    axios.get('http://localhost:5000/api/data')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    document.body.style.cursor = 'auto'; // Reset cursor behavior inside admin
    fetchData();
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('price', productForm.price);
    formData.append('category', productForm.category);
    formData.append('desc', productForm.desc);
    if(productImg) formData.append('image', productImg);

    await axios.post('http://localhost:5000/api/products', formData);
    fetchData();
    setProductForm({ name: '', price: '', category: 'bracelet', desc: '' });
    setProductImg(null);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchData();
  };

  const handleUpdateHero = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    if(heroForm.title) formData.append('title', heroForm.title);
    if(heroForm.subtitle) formData.append('subtitle', heroForm.subtitle);
    if(heroImg) formData.append('image', heroImg);

    await axios.post('http://localhost:5000/api/hero', formData);
    fetchData();
    setHeroForm({ title: '', subtitle: '' });
    setHeroImg(null);
  };

  return (
    <div style={{ padding: '80px 5%', maxWidth: '1200px', margin: '0 auto', fontFamily: 'Inter, sans-serif' }}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <h1 style={{ marginBottom: '2rem' }}>VIS SPOT Admin Dashboard</h1>
          <a href="/" className="btn btn-outline" style={{marginBottom: '2rem'}}>Return to Store</a>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '3rem' }}>
        {/* Products Management */}
        <section style={{ background: '#f9f9f9', padding: '3rem', borderRadius: '8px' }}>
          <h2>Manage Products</h2>
          <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
            <input placeholder="Product Name" value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} required className="btn-outline" style={{padding:'12px', background: 'white'}}/>
            <input type="number" placeholder="Price (INR)" value={productForm.price} onChange={e => setProductForm({...productForm, price: e.target.value})} required className="btn-outline" style={{padding:'12px', background: 'white'}}/>
            <select value={productForm.category} onChange={e => setProductForm({...productForm, category: e.target.value})} className="btn-outline" style={{padding:'12px', background: 'white'}}>
              <option value="bracelet">Bracelet</option>
              <option value="charm">Phone Charm</option>
              <option value="keychain">Keychain</option>
            </select>
            <input type="file" accept="image/*" onChange={e => setProductImg(e.target.files[0])} style={{padding:'12px', background: 'white', border: '1px solid var(--border)'}} />
            <textarea placeholder="Description" value={productForm.desc} onChange={e => setProductForm({...productForm, desc: e.target.value})} required className="btn-outline" style={{padding:'12px', gridColumn: 'span 2', background: 'white', minHeight:'100px'}}></textarea>
            
            <button type="submit" className="btn btn-primary" style={{gridColumn: 'span 2'}}>Add New Product</button>
          </form>

          <h3 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Current Store Inventory</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {data.products.map(p => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '1rem', border: '1px solid var(--border)', borderRadius: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <img src={p.img} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                  <div>
                    <p style={{ fontWeight: '500', color: 'black', margin: 0 }}>{p.name}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>₹{p.price}</p>
                  </div>
                </div>
                <button onClick={() => handleDelete(p.id)} style={{ background: '#e0e0e0', color: 'black', border: 'none', padding: '8px 12px', cursor: 'pointer', borderRadius: '4px' }}>Remove</button>
              </div>
            ))}
          </div>
        </section>

        {/* Hero Management */}
        <section style={{ background: '#f9f9f9', padding: '3rem', borderRadius: '8px' }}>
          <h2>Update Homepage Hero</h2>
          <form onSubmit={handleUpdateHero} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
            <input placeholder="New Headline (HTML tags allowed, ex: Hello<br>World)" value={heroForm.title} onChange={e => setHeroForm({...heroForm, title: e.target.value})} className="btn-outline" style={{padding:'12px', background: 'white'}}/>
            <input placeholder="New Subtitle description" value={heroForm.subtitle} onChange={e => setHeroForm({...heroForm, subtitle: e.target.value})} className="btn-outline" style={{padding:'12px', background: 'white'}}/>
            
            <div style={{background: 'white', padding: '1rem', border: '1px solid var(--border)', borderRadius: '4px'}}>
              <label style={{display: 'block', marginBottom: '0.5rem', fontWeight:'500'}}>Upload New Hero Background</label>
              <input type="file" accept="image/*" onChange={e => setHeroImg(e.target.files[0])} />
            </div>
            
            <button type="submit" className="btn btn-primary" style={{marginTop: '1rem'}}>Deploy Hero Updates</button>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <p><strong>Current Active Hero:</strong></p>
            <img src={data.hero?.image} style={{ width: '100%', maxWidth: '500px', height: 'auto', borderRadius: '8px', marginTop: '1rem', border: '1px solid var(--border)' }} />
          </div>
        </section>
      </div>
    </div>
  );
}
