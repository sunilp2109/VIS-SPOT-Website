import { useState, useEffect } from 'react';
import axios from 'axios';

export default function SettingsView() {
  const [heroForm, setHeroForm] = useState({ title: '', subtitle: '' });
  const [heroImg, setHeroImg] = useState(null);
  const [currentHero, setCurrentHero] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchHero = async () => {
    const res = await axios.get('http://localhost:5000/api/data');
    setCurrentHero(res.data.hero);
  };

  useEffect(() => { fetchHero(); }, []);

  const handleUpdateHero = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    if (heroForm.title) formData.append('title', heroForm.title);
    if (heroForm.subtitle) formData.append('subtitle', heroForm.subtitle);
    if (heroImg) formData.append('image', heroImg);

    const token = localStorage.getItem('adminToken');
    await axios.post('http://localhost:5000/api/hero', formData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setHeroForm({ title: '', subtitle: '' });
    setHeroImg(null);
    fetchHero();
    setLoading(false);
  };

  return (
    <div>
      <h1 style={{ fontSize: '2rem', marginBottom: '2.5rem', fontWeight: '600' }}>Storefront Configuration</h1>

      <div style={{ background: 'white', borderRadius: '16px', padding: '2.5rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', maxWidth: '900px' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '2rem', fontWeight: '500' }}>Hero Aesthetics</h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
          <form onSubmit={handleUpdateHero} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>Primary Headline</label>
              <input type="text" value={heroForm.title} onChange={e => setHeroForm({ ...heroForm, title: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem' }} placeholder="Supports React HTML DOM strings" />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>Sub-headline Text</label>
              <input type="text" value={heroForm.subtitle} onChange={e => setHeroForm({ ...heroForm, subtitle: e.target.value })} style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '0.95rem' }} />
            </div>

            <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '8px', border: '1px dashed #ccc' }}>
              <label style={{ display: 'block', fontSize: '0.9rem', marginBottom: '0.5rem', fontWeight: '500' }}>Upload Hero Background</label>
              <input type="file" accept="image/*" onChange={e => setHeroImg(e.target.files[0])} style={{ fontSize: '0.85rem' }} />
            </div>

            <button type="submit" disabled={loading} style={{ padding: '14px', background: 'black', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', alignSelf: 'flex-start', minWidth: '150px' }}>
              {loading ? 'Redeploying Node...' : 'Save Settings'}
            </button>
          </form>

          <div style={{ background: '#f9f9f9', padding: '1.5rem', borderRadius: '12px', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem', fontWeight: '500' }}>Active Live Preview</h3>
            {currentHero ? (
              <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}>
                <img src={currentHero.image} style={{ width: '100%', height: 'auto', display: 'block', objectFit: 'cover' }} />
              </div>
            ) : <p>Loading preview...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
