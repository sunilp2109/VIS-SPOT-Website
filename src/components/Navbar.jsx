export default function Navbar({ cartCount, openCart }) {
  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if(el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav className="navbar" id="navbar">
      <div className="nav-container">
        <a href="#" className="logo">VIS SPOT</a>
        <div className="nav-links">
          <a href="#featured" onClick={(e) => handleScrollTo(e, 'featured')}>Featured</a>
          <a href="#collection" onClick={(e) => handleScrollTo(e, 'collection')}>Shop</a>
          <a href="#custom" onClick={(e) => handleScrollTo(e, 'custom')}>Custom</a>
          <a href="#about" onClick={(e) => handleScrollTo(e, 'about')}>About</a>
        </div>
        <div className="nav-actions">
          <button className="cart-toggle" aria-label="Open Cart" onClick={openCart}>
            Cart (<span>{cartCount}</span>)
          </button>
        </div>
      </div>
    </nav>
  );
}
