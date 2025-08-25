import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import todoRoutes from './routes/todos';
import authFallbackRoutes from './routes/auth-fallback';
import todosFallbackRoutes from './routes/todos-fallback';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// State to track MongoDB connection
let mongoConnected = false;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());

// Health check
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Todo API is running',
    database: mongoConnected ? 'MongoDB' : 'In-Memory',
    timestamp: new Date().toISOString()
  });
});

// Try to connect to MongoDB with shorter timeout
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

// Always set fallback routes first as default
console.log('📝 Using in-memory storage for development');
app.use('/api/auth', authFallbackRoutes);
app.use('/api/todos', todosFallbackRoutes);

// Try MongoDB connection in background
mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2000 })
  .then(() => {
    console.log('✅ MongoDB available but using fallback for stability');
    mongoConnected = true;
  })
  .catch((error) => {
    console.warn('⚠️  MongoDB connection failed:', error.message);
    mongoConnected = false;
  });

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
  console.log(`💡 Health check: http://localhost:${PORT}/api/health`);
});

export default app;