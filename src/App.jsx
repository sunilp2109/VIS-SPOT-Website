import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductGrid from './components/ProductGrid';
import CartSidebar from './components/CartSidebar';
import CustomOrder from './components/CustomOrder';
import Gallery from './components/Gallery';
import Reviews from './components/Reviews';
import Footer from './components/Footer';
import ProductModal from './components/ProductModal';
import { products } from './data';

function App() {
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Setup intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    setTimeout(() => {
      document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }, 100);

    // Navbar scroll effect
    const handleScroll = () => {
      const navbar = document.getElementById('navbar');
      if (navbar) {
        if (window.scrollY > 20) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        return prev.map(item => item.id === productId ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, qty: item.qty + delta };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  return (
    <>
      <Navbar cartCount={cart.reduce((sum, item) => sum + item.qty, 0)} openCart={() => setIsCartOpen(true)} />

      <CartSidebar
        isOpen={isCartOpen}
        closeCart={() => setIsCartOpen(false)}
        cart={cart}
        updateQty={updateQty}
      />

      <div className={`modal-overlay ${selectedProduct ? 'modal-open' : ''}`} id="product-modal">
        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            close={() => setSelectedProduct(null)}
            addToCart={() => {
              addToCart(selectedProduct.id);
              setSelectedProduct(null);
            }}
          />
        )}
      </div>

      <main>
        <Hero />
        <ProductGrid products={products} addToCart={addToCart} openModal={setSelectedProduct} />
        <CustomOrder />
        <Gallery />
        <Reviews />
      </main>
      <Footer />
    </>
  );
}

export default App;
