import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/login', { username, password });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '3rem', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
        <h1 style={{ fontSize: '1.5rem', marginBottom: '2rem', textAlign: 'center', fontWeight: '500' }}>VIS SPOT <br/><span style={{fontSize:'1rem', color:'#666'}}>Admin Access</span></h1>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          {error && <p style={{ color: '#D32F2F', fontSize: '0.9rem', textAlign: 'center', background:'#FFEBEE', padding:'10px', borderRadius:'6px' }}>{error}</p>}
          
          <div>
            <label style={{display:'block', fontSize:'0.85rem', color:'#555', marginBottom:'0.4rem'}}>Username</label>
            <input 
              type="text" 
              value={username} 
              onChange={e => setUsername(e.target.value)} 
              required 
              style={{ width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '6px', fontSize:'1rem' }}
            />
          </div>
          
          <div>
            <label style={{display:'block', fontSize:'0.85rem', color:'#555', marginBottom:'0.4rem'}}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
              style={{ width: '100%', padding: '14px', border: '1px solid #ddd', borderRadius: '6px', fontSize:'1rem' }}
            />
          </div>
          
          <button type="submit" style={{ padding: '16px', background: 'black', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', marginTop: '1rem', transition:'background 0.3s' }}>
            Enter Portal
          </button>
        </form>
      </div>
    </div>
  );
}
