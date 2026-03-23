import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import ProductGrid from '../components/ProductGrid';
import CartSidebar from '../components/CartSidebar';
import CustomOrder from '../components/CustomOrder';
import Gallery from '../components/Gallery';
import Reviews from '../components/Reviews';
import Footer from '../components/Footer';
import ProductModal from '../components/ProductModal';

export default function Storefront() {
  const [data, setData] = useState({ products: [], hero: {} });
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset to aesthetic cursor globally incase arriving from admin
    document.body.style.cursor = "url('data:image/svg+xml;utf8,<svg width=\"24\" height=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><polygon points=\"2,2 18,9 11,11 8,20\" fill=\"%23000\"/></svg>') 2 2, default";

    axios.get('http://localhost:5000/api/data')
      .then(res => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Storefront API Error:", err);
        setIsLoading(false);
      });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appear');
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    setTimeout(() => {
      document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
    }, 500);

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
    const product = data.products.find(p => p.id === productId);
    if (!product) return;
    
    let shouldOpen = true;
    setCart(prev => {
      const existing = prev.find(item => item.id === productId);
      if (existing) {
        if (existing.qty >= product.stock) {
          alert(`Out of stock! Maximum available quantity (${product.stock}) reached.`);
          shouldOpen = false;
          return prev;
        }
        return prev.map(item => item.id === productId ? { ...item, qty: item.qty + 1 } : item);
      }
      if (product.stock <= 0) {
        alert('Out of stock! No units available.');
        shouldOpen = false;
        return prev;
      }
      return [...prev, { ...product, qty: 1 }];
    });
    if (shouldOpen) setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    const product = data.products.find(p => p.id === id);
    if (!product) return;
    
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = item.qty + delta;
        if (newQty > product.stock) {
          alert(`Inventory limit reached. Only ${product.stock} units in stock.`);
          return item;
        }
        return { ...item, qty: newQty };
      }
      return item;
    }).filter(item => item.qty > 0));
  };

  if (isLoading) {
    return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Connecting to VIS SPOT API Server...</div>;
  }

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
        <Hero hero={data.hero} />
        <ProductGrid products={data.products} addToCart={addToCart} openModal={setSelectedProduct} />
        <CustomOrder />
        <Gallery />
        <Reviews />
      </main>

      <Footer />
    </>
  );
}
