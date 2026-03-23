import { useState } from 'react';

export default function ProductGrid({ products, addToCart, openModal }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  return (
    <>
      <section id="featured" className="section">
        <div className="section-header fade-in">
          <h2>Featured Collection</h2>
          <a href="#collection" className="link">View All</a>
        </div>
        <div className="product-grid" id="featured-grid">
          {products.slice(0, 4).map(item => (
            <ProductCard key={item.id} item={item} addToCart={addToCart} openModal={openModal} />
          ))}
        </div>
      </section>

      <section id="collection" className="section bg-secondary">
        <div className="section-header text-center fade-in">
          <h2>Shop the Collection</h2>
        </div>
        <div className="filter-tabs fade-in">
          {['all', 'bracelet', 'keychain', 'charm'].map(tab => (
            <button 
              key={tab} 
              className={`tab ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab === 'all' ? 'All' : tab.charAt(0).toUpperCase() + tab.slice(1) + 's'}
            </button>
          ))}
        </div>
        <div className="product-grid collection-grid">
          {filtered.map(item => (
             <ProductCard key={item.id} item={item} addToCart={addToCart} openModal={openModal} />
          ))}
        </div>
      </section>
    </>
  );
}

function ProductCard({ item, addToCart, openModal }) {
  return (
    <div className="product-card fade-in">
      <div className="product-img-wrap" onClick={() => openModal(item)}>
        <img src={item.img} alt={item.name} />
        <button 
          className="add-btn" 
          onClick={(e) => { e.stopPropagation(); if(item.stock > 0) addToCart(item.id); else alert('Out of stock!'); }}
          style={item.stock <= 0 ? { cursor: 'not-allowed', background: '#f5f5f5', color: '#999', opacity: 1 } : {}}
        >
          {item.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
      <div className="product-info">
        <div>
          <h3 className="product-title">{item.name}</h3>
        </div>
        <span className="product-price">₹{item.price.toLocaleString('en-IN')}</span>
      </div>
    </div>
  );
}
