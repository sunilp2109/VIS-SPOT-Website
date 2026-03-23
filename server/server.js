const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const dbPath = path.join(__dirname, 'db.json');

app.use(cors());
app.use(express.json());

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../public/assets'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

const readDB = () => JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const writeDB = (data) => fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));

// Auth Login
app.post('/api/login', (req, res) => {
  const db = readDB();
  const { username, password } = req.body;
  if (username === db.admin.username && password === db.admin.password) {
    res.json({ token: 'vis-spot-admin-jwt-token-123' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Middleware to protect routes
const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === 'Bearer vis-spot-admin-jwt-token-123') {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

app.get('/api/data', (req, res) => {
  const db = readDB();
  res.json({ products: db.products, hero: db.hero });
});

// Phase 2: Enhanced Dashboard Stats (Protected)
app.get('/api/dashboard', verifyAdmin, (req, res) => {
  const db = readDB();
  const totalRevenue = db.orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = db.orders.length;
  const lowStockItems = db.products.filter(p => p.stock <= 5);

  // Calculate Most Sold Items
  const salesMap = {};
  db.orders.forEach(order => {
    order.items?.forEach(item => {
      if (!salesMap[item.name]) salesMap[item.name] = 0;
      salesMap[item.name] += item.qty;
    });
  });

  const topProducts = Object.entries(salesMap)
    .map(([name, qty]) => ({ name, qty }))
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);

  res.json({
    totalRevenue,
    totalOrders,
    lowStockAlerts: lowStockItems.length,
    lowStockItems, // Phase 2: raw array injection
    topProducts, // Phase 2: analytics algorithms
    recentOrders: db.orders.slice(-5).reverse()
  });
});

// Phase 2: Order Management Integrations
app.get('/api/orders', verifyAdmin, (req, res) => {
  const db = readDB();
  res.json(db.orders.reverse());
});

app.patch('/api/orders/:id/status', verifyAdmin, (req, res) => {
  const db = readDB();
  const order = db.orders.find(o => o.id === parseInt(req.params.id));
  if (order) {
    order.status = req.body.status;
    writeDB(db);
    res.json({ message: 'Order status patched securely', order });
  } else {
    res.status(404).json({ message: 'Order reference not found' });
  }
});

// Place External Order
app.post('/api/orders', (req, res) => {
  const db = readDB();
  const newOrder = {
    id: Date.now(),
    customer: 'WhatsApp Client',
    total: req.body.total,
    status: 'Pending',
    date: new Date().toISOString(),
    items: req.body.items
  };

  // Automatically strip stock logic
  if (req.body.items && Array.isArray(req.body.items)) {
    req.body.items.forEach(item => {
      const product = db.products.find(p => p.id === item.id);
      if (product) {
        product.stock = Math.max(0, product.stock - item.qty);
      }
    });
  }

  db.orders.push(newOrder);
  writeDB(db);
  res.json({ success: true, orderId: newOrder.id });
});

app.post('/api/products', verifyAdmin, upload.single('image'), (req, res) => {
  const db = readDB();
  const newProduct = {
    id: Date.now(),
    name: req.body.name,
    price: Number(req.body.price),
    category: req.body.category,
    desc: req.body.desc,
    stock: Number(req.body.stock || 0),
    img: req.file ? `/assets/${req.file.filename}` : '/assets/p1.jpg'
  };
  db.products.push(newProduct);
  writeDB(db);
  res.json({ message: 'Product added', product: newProduct });
});

app.delete('/api/products/:id', verifyAdmin, (req, res) => {
  const db = readDB();
  db.products = db.products.filter(p => p.id !== parseInt(req.params.id));
  writeDB(db);
  res.json({ message: 'Product deleted' });
});

app.post('/api/hero', verifyAdmin, upload.single('image'), (req, res) => {
  const db = readDB();
  if (req.file) {
    db.hero.image = `/assets/${req.file.filename}`;
  }
  if (req.body.title) db.hero.title = req.body.title;
  if (req.body.subtitle) db.hero.subtitle = req.body.subtitle;
  writeDB(db);
  res.json({ message: 'Hero updated', hero: db.hero });
});

app.listen(PORT, () => console.log(`Server mapped onto http://localhost:${PORT}`));
