import express from 'express';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB } from './config/db.js';
import { setSocketIO } from './services/notificationService.js';
import { User } from './models/User.js';
import { seedDatabase } from './seed.js';

// Route imports
import authRoutes from './routes/auth.js';
import complaintRoutes from './routes/complaints.js';
import wasteRoutes from './routes/waste.js';
import waterRoutes from './routes/water.js';
import energyRoutes from './routes/energy.js';
import aiRoutes from './routes/ai.js';
import analyticsRoutes from './routes/analytics.js';
import notificationRoutes from './routes/notifications.js';
import userRoutes from './routes/users.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO with CORS
const io = new SocketIOServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
setSocketIO(io);

// Socket.IO real-time rooms & event handlers
io.on('connection', (socket) => {
  console.log(`[Socket] Client connected: ${socket.id}`);

  socket.on('join', ({ userId, role }) => {
    if (userId) {
      socket.join(`user:${userId}`);
      console.log(`[Socket] ${socket.id} joined user room: user:${userId}`);
    }
    if (role) {
      socket.join(`role:${role}`);
      console.log(`[Socket] ${socket.id} joined role room: role:${role}`);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[Socket] Client disconnected: ${socket.id}`);
  });
});

// Middleware
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Static uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'EcoVerse AI Smart Village & Smart City Management Platform',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
  });
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/water', waterRoutes);
app.use('/api/energy', energyRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/users', userRoutes);

// Serve client static build in production or when client/dist exists
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// 404 handler for API routes
app.all('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `API route ${req.originalUrl} not found.` });
});

// Catch-all route to serve client index.html for SPA routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) return next();
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('EcoVerse AI Backend API is active. Run frontend with npm run dev.');
    }
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('[ServerError]', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

const PORT = process.env.PORT || 5000;

export const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed if database is empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('[Bootstrap] No existing user records detected. Running auto-seed...');
      await seedDatabase();
    } else {
      console.log(`[Bootstrap] Database ready with ${userCount} existing users.`);
    }

    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🌿 EcoVerse AI Backend Server running on port ${PORT}`);
      console.log(`🌐 Base API URL: http://localhost:${PORT}/api`);
      console.log(`⚡ Socket.IO real-time server active`);
      console.log(`====================================================`);
    });

    return server;
  } catch (err) {
    console.error('[Bootstrap] Failed to initialize server:', err);
    process.exit(1);
  }
};

// Start server if executed directly
if (process.argv[1]?.endsWith('server.js')) {
  startServer();
}

export { app, server };
