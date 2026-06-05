
// =====================================================

const express    = require('express');
const bcrypt     = require('bcryptjs');
const jwt        = require('jsonwebtoken');
const cors       = require('cors');
const path       = require('path');
const Anthropic  = require('@anthropic-ai/sdk');

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ===== CONFIG =====
const JWT_SECRET        = process.env.JWT_SECRET        || 'amezone-secret-key-change-in-production';
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || 'your-anthropic-api-key-here';
const PORT              = process.env.PORT              || 5000;

// ===== IN-MEMORY DATABASE =====
// (Replace with MongoDB/MySQL for production)
const users = [];
const cart  = [];

// ===== HELPER: Generate JWT =====
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ===== MIDDLEWARE: Verify JWT =====
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized. Please sign in.' });
  }
  try {
    const token   = header.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user      = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token. Please sign in again.' });
  }
}

// =====================================================
//  AUTH ROUTES
// =====================================================

// POST /api/register
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'Name, email and password are required.' });
    if (password.length < 8)
      return res.status(400).json({ message: 'Password must be at least 8 characters.' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    if (users.find(u => u.email === email.toLowerCase()))
      return res.status(409).json({ message: 'An account with this email already exists.' });

    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = {
      id: users.length + 1,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone || '',
      passwordHash,
      createdAt: new Date().toISOString()
    };
    users.push(newUser);

    const token = generateToken(newUser);
    console.log(`New user registered: ${newUser.name} (${newUser.email})`);

    res.status(201).json({
      message: 'Account created successfully!',
      token,
      user: { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone }
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// POST /api/login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required.' });

    const user = users.find(u => u.email === email.toLowerCase());
    if (!user)
      return res.status(401).json({ message: 'Incorrect email or password.' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch)
      return res.status(401).json({ message: 'Incorrect email or password.' });

    const token = generateToken(user);
    console.log(`User signed in: ${user.name} (${user.email})`);

    res.json({
      message: 'Signed in successfully!',
      token,
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

// GET /api/me  (requires token)
app.get('/api/me', authMiddleware, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found.' });
  res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone, createdAt: user.createdAt });
});

// =====================================================
//  CART ROUTES
// =====================================================

// GET /api/cart
app.get('/api/cart', (req, res) => {
  res.json(cart);
});

// POST /api/cart
app.post('/api/cart', (req, res) => {
  const { name, price, qty, img_url } = req.body;
  if (!name || !price)
    return res.status(400).json({ message: 'Name and price are required.' });
  const item = { id: cart.length + 1, name, price: parseFloat(price), qty: parseInt(qty) || 1, img_url: img_url || '' };
  cart.push(item);
  console.log(`Cart item added: ${item.name}`);
  res.status(201).json(item);
});

// PUT /api/cart/:id
app.put('/api/cart/:id', (req, res) => {
  const item = cart.find(c => c.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Cart item not found.' });
  item.qty = parseInt(req.body.qty) || item.qty;
  res.json(item);
});

// DELETE /api/cart/:id
app.delete('/api/cart/:id', (req, res) => {
  const idx = cart.findIndex(c => c.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ message: 'Cart item not found.' });
  cart.splice(idx, 1);
  res.json({ message: 'Item removed from cart.' });
});

// DELETE /api/cart  (clear all)
app.delete('/api/cart', (req, res) => {
  cart.length = 0;
  res.json({ message: 'Cart cleared.' });
});

// =====================================================
//  CLAUDE AI ROUTE
// =====================================================

// POST /api/ai/help
app.post('/api/ai/help', async (req, res) => {
  try {
    const { email, question } = req.body;

    const prompt = question
      ? question
      : email
        ? `A user on "Amezone" shopping site can't sign in with email: ${email}. Give 2-3 short friendly troubleshooting tips. Plain text, no markdown.`
        : `A user on "Amezone" shopping site needs help signing in. Give 2-3 short friendly tips. Plain text, no markdown.`;

    const client   = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
    const response = await client.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 300,
      messages:   [{ role: 'user', content: prompt }]
    });

    const answer = response.content?.[0]?.text || 'Sorry, could not get a response.';
    res.json({ answer });
  } catch (err) {
    console.error('AI error:', err.message);
    res.status(500).json({ answer: 'Could not connect to Claude AI. Please try again.' });
  }
});

// =====================================================
//  HEALTH CHECK
// =====================================================
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Amezone API is running!', users: users.length, cart: cart.length, time: new Date().toISOString() });
});

// =====================================================
//  START SERVER
// =====================================================
app.listen(PORT, () => {
  console.log('');
  console.log('Amezone Server started!');
  console.log('API running at: http://localhost:' + PORT);
  console.log('Open website:   http://localhost:' + PORT + '/index.html');
  console.log('Login page:     http://localhost:' + PORT + '/u1.html');
  console.log('');
  console.log('API Routes:');
  console.log('  POST   /api/register');
  console.log('  POST   /api/login');
  console.log('  GET    /api/me          (token required)');
  console.log('  GET    /api/cart');
  console.log('  POST   /api/cart');
  console.log('  PUT    /api/cart/:id');
  console.log('  DELETE /api/cart/:id');
  console.log('  DELETE /api/cart');
  console.log('  POST   /api/ai/help');
  console.log('  GET    /api/health');
  console.log('');
});