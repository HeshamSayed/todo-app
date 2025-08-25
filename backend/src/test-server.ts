import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Basic middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Simple health check
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({ 
    status: 'OK', 
    message: 'Todo API is running',
    timestamp: new Date().toISOString()
  });
});

// Simple auth test routes
app.post('/api/auth/test', (req: express.Request, res: express.Response) => {
  res.json({ message: 'Auth test endpoint working' });
});

app.get('/api/todos/test', (req: express.Request, res: express.Response) => {
  res.json({ 
    message: 'Todos test endpoint working',
    todos: [
      { id: 1, title: 'Test todo 1', completed: false },
      { id: 2, title: 'Test todo 2', completed: true }
    ]
  });
});

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`);
  console.log(`🌐 API available at: http://localhost:${PORT}`);
  console.log(`💡 Health check: http://localhost:${PORT}/api/health`);
});

export default app;