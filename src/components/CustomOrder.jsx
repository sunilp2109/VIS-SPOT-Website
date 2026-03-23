import { useState } from 'react';

export default function CustomOrder() {
  const [status, setStatus] = useState('Request Custom Order');
  const [bgLabel, setBgLabel] = useState('var(--accent)');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Request Sent ✓');
    setBgLabel('#000');
    setTimeout(() => {
      setStatus('Request Custom Order');
      setBgLabel('var(--accent)');
      e.target.reset();
    }, 3000);
  };

  return (
    <section id="custom" className="section text-center">
      <div className="custom-content fade-in">
        <h2>Create Something Unique</h2>
        <p>Can't find exactly what you're looking for? Let's design it together.</p>
        <form className="custom-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Your Name" required />
          <input type="text" placeholder="Color Preference (e.g. Sage Green & Gold)" required />
          <textarea placeholder="Tell us what you have in mind..." rows="4" required></textarea>
          <button type="submit" className="btn btn-primary" style={{ background: bgLabel, color: status.includes('✓') ? '#fff' : '' }}>
            {status}
          </button>
        </form>
      </div>
    </section>
  );
}
