// Data
const products = [
    { id: 1, name: 'Onyx Beaded Bracelet', price: 24.00, category: 'bracelet', img: 'assets/p1.jpg', desc: 'Minimalist matte onyx stones carefully strung together for an elegant everyday look. Handmade with durable stretch cord.' },
    { id: 2, name: 'Silver Initial Charm', price: 18.00, category: 'charm', img: 'assets/p2.jpg', desc: 'A subtle, personalized touch to your phone. Made from high-quality stainless steel that won\\'t tarnish over time.' },
    { id: 3, name: 'Leather Loop Keychain', price: 22.00, category: 'keychain', img: 'assets/p3.jpg', desc: 'Premium vegan leather loop with a sturdy matte black ring. Keep your keys organized in style.' },
    { id: 4, name: 'Pearl Drop Bracelet', price: 28.00, category: 'bracelet', img: 'assets/p4.jpg', desc: 'Freshwater pearls combined with a delicate gold-filled chain. Elevate any outfit effortlessly.' },
    { id: 5, name: 'Aura Phone String', price: 15.00, category: 'charm', img: 'assets/p5.jpg', desc: 'Aesthetic clear beads catching the light perfectly. Adds personality and security to your mobile device.' },
    { id: 6, name: 'Minimalist Bar Keychain', price: 20.00, category: 'keychain', img: 'assets/p6.jpg', desc: 'Sleek geometric bar design that fits perfectly in your pocket without the bulk.' }
];

let cart = [];

// DOM Elements
const featuredGrid = document.getElementById('featured-grid');
const collectionGrid = document.getElementById('collection-grid');
const tabs = document.querySelectorAll('.tab');

// Cart
const cartToggle = document.querySelector('.cart-toggle');
const closeCartBtn = document.getElementById('close-cart');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotalPrice = document.getElementById('cart-total-price');

// Modal
const modalOverlay = document.getElementById('product-modal');
const closeModalBtn = document.getElementById('close-modal');

// Init
function init() {
    renderProducts(products, featuredGrid, 4);
    renderProducts(products, collectionGrid);
    setupScrollObserver();
    setupNavbarScroll();
    updateCartUI();
}

function renderProducts(items, container, limit = null) {
    if(!container) return;
    container.innerHTML = '';
    const displayItems = limit ? items.slice(0, limit) : items;
    
    displayItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'product-card fade-in appear';
        card.innerHTML = `
            <div class="product-img-wrap" onclick="openModal(${item.id})">
                <img src="${item.img}" alt="${item.name}">
                <button class="add-btn" onclick="event.stopPropagation(); addToCart(${item.id})">Add to Cart</button>
            </div>
            <div class="product-info">
                <div>
                    <h3 class="product-title">${item.name}</h3>
                </div>
                <span class="product-price">$${item.price.toFixed(2)}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Filtering
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter');
        const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);
        renderProducts(filtered, collectionGrid);
    });
});

// Modal Logic
function openModal(id) {
    const product = products.find(p => p.id === id);
    if(!product) return;
    
    document.getElementById('modal-img').src = product.img;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modal-desc').textContent = product.desc;
    
    const addBtn = document.getElementById('modal-add-to-cart');
    addBtn.onclick = () => { addToCart(product.id); closeModal(); };
    
    document.body.classList.add('modal-open');
}

function closeModal() { 
    document.body.classList.remove('modal-open'); 
}

if(closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
if(modalOverlay) modalOverlay.addEventListener('click', (e) => { 
    if(e.target === modalOverlay) closeModal(); 
});

// Cart Logic
window.addToCart = function(id) {
    const product = products.find(p => p.id === id);
    if(!product) return;
    
    const existing = cart.find(item => item.id === id);
    if(existing) {
        existing.qty += 1;
    } else {
        cart.push({ ...product, qty: 1 });
    }
    updateCartUI();
    openCart();
};

window.updateQty = function(id, delta) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.qty += delta;
        if(item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        updateCartUI();
    }
};

function updateCartUI() {
    if(!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let count = 0;
    
    if(cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="color:var(--text-muted); text-align:center; margin-top:2rem;">Your bag is empty.</p>';
    } else {
        cart.forEach(item => {
            total += item.price * item.qty;
            count += item.qty;
            cartItemsContainer.innerHTML += `
                <div class="cart-item">
                    <img src="${item.img}" class="cart-item-img" alt="${item.name}">
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                        <div class="qty-controls">
                            <button class="qty-btn" onclick="updateQty(${item.id}, -1)">-</button>
                            <span style="font-size:0.9rem">${item.qty}</span>
                            <button class="qty-btn" onclick="updateQty(${item.id}, 1)">+</button>
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    if(cartCount) cartCount.textContent = count;
    if(cartTotalPrice) cartTotalPrice.textContent = `$${total.toFixed(2)}`;
}

// Cart Sidebar handling
function openCart() { document.body.classList.add('cart-open'); }
function closeCart() { document.body.classList.remove('cart-open'); }

if(cartToggle) cartToggle.addEventListener('click', openCart);
if(closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
if(cartOverlay) cartOverlay.addEventListener('click', closeCart);

// Scroll Animations
function setupScrollObserver() {
    const faders = document.querySelectorAll('.fade-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if(entry.isIntersecting) {
                entry.target.classList.add('appear');
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    
    faders.forEach(fader => {
        observer.observe(fader);
    });
}

// Navbar Scroll Effect
function setupNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if(!navbar) return;
    
    window.addEventListener('scroll', () => {
        if(window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Custom Form
const customForm = document.getElementById('custom-form');
if(customForm) {
    customForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        if(btn) {
            btn.textContent = 'Request Sent ✓';
            btn.style.background = '#000';
            btn.style.color = '#fff';
            setTimeout(() => {
                btn.textContent = 'Request Custom Order';
                btn.style.background = 'var(--accent)';
                e.target.reset();
            }, 3000);
        }
    });
}

// Smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        if(this.getAttribute('href') === '#') return;
        e.preventDefault();
        const targetElement = document.querySelector(this.getAttribute('href'));
        if(targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            // Close mobile menu if exists
        }
    });
});

document.addEventListener('DOMContentLoaded', init);
