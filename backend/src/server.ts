import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import todoRoutes from './routes/todos';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Health check
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ status: 'OK', message: 'Todo API is running' });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Connect to MongoDB (with graceful fallback)
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/todoapp';

mongoose.connect(mongoUri)
  .then(() => {
    console.log('✅ Connected to MongoDB');
  })
  .catch((error) => {
    console.warn('⚠️  MongoDB connection failed:', error.message);
    console.log('📝 Server will start but database features will not work');
  });

// Start server regardless of MongoDB connection
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
  console.log(`💡 Health check: http://localhost:${PORT}/api/health`);
});

export default app;