export default function CartSidebar({ isOpen, closeCart, cart, updateQty }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <>
      <div 
        className="cart-overlay" 
        onClick={closeCart} 
        style={{opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'auto' : 'none'}}
      ></div>
      <div 
        className="cart-panel" 
        style={{transform: isOpen ? 'translateX(0)' : 'translateX(100%)'}}
      >
        <div className="cart-header">
          <h3>Your Bag</h3>
          <button className="close-cart" onClick={closeCart}>&times;</button>
        </div>
        <div className="cart-items">
          {cart.length === 0 ? (
            <p style={{color: 'var(--text-muted)', textAlign: 'center', marginTop: '2rem'}}>Your bag is empty.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} className="cart-item">
                <img src={item.img} className="cart-item-img" alt={item.name} />
                <div className="cart-item-info">
                  <div className="cart-item-title">{item.name}</div>
                  <div className="cart-item-price">₹{item.price.toLocaleString('en-IN')}</div>
                  <div className="qty-controls">
                    <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>-</button>
                    <span style={{fontSize: '0.9rem'}}>{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-footer">
          <div className="cart-total">
            <span>Total</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <button className="btn btn-primary full-width">Checkout</button>
        </div>
      </div>
    </>
  );
}
