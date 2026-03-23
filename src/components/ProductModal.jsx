export default function ProductModal({ product, close, addToCart }) {
  if (!product) return null;

  return (
    <div className="modal-content">
      <button className="close-modal" onClick={close}>&times;</button>
      <div className="modal-grid">
        <div className="modal-img-container">
          <img src={product.img} alt={product.name} />
        </div>
        <div className="modal-info">
          <h2>{product.name}</h2>
          <p className="price">₹{product.price.toLocaleString('en-IN')}</p>
          <p className="desc">{product.desc}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => { if(product.stock > 0) addToCart(); else alert('Out of stock!'); }}
            style={product.stock <= 0 ? { background: '#ccc', cursor: 'not-allowed', color: '#666', border: 'none' } : {}}
          >
            {product.stock <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
