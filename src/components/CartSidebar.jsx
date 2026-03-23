import axios from 'axios';

export default function CartSidebar({ isOpen, closeCart, cart, updateQty }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const handleWhatsAppCheckout = async () => {
    if (cart.length === 0) return;
    
    // Log Order to Dashboard First
    try {
      await axios.post('http://localhost:5000/api/orders', {
        total: total,
        items: cart.map(i => ({ id: i.id, name: i.name, qty: i.qty }))
      });
    } catch (e) {
      console.error("Order logging error", e);
    }
    
    const phoneNumber = "919000000000"; // Example business number
    let msg = "Hello *VIS SPOT*! ✨\nI would like to place an order for the following items:\n\n";
    
    cart.forEach(item => {
      msg += `▪️ ${item.qty}x *${item.name}* (₹${item.price.toLocaleString('en-IN')})\n`;
    });
    
    msg += `\n*TOTAL: ₹${total.toLocaleString('en-IN')}*\n\nPlease let me know the payment details.`;
    
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

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
          <button 
            className="btn btn-primary full-width" 
            style={{background: '#25D366'}} 
            onClick={handleWhatsAppCheckout}
          >
            Checkout via WhatsApp
          </button>
        </div>
      </div>
    </>
  );
}
