import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// In-memory storage for demo purposes
const todos: any[] = [];

// Authentication middleware
const auth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    (req as any).userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Get todos
router.get('/', auth, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).userId;
    const userTodos = todos.filter(todo => todo.userId === userId);
    
    res.json({
      todos: userTodos,
      pagination: {
        page: 1,
        pages: 1,
        total: userTodos.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create todo
router.post('/', auth, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).userId;
    const { title, description, priority, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const todo = {
      _id: Date.now().toString(),
      title,
      description: description || '',
      priority: priority || 'medium',
      dueDate,
      completed: false,
      userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    todos.push(todo);
    res.status(201).json(todo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update todo
router.put('/:id', auth, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).userId;
    const todoId = req.params.id;
    
    const todoIndex = todos.findIndex(todo => todo._id === todoId && todo.userId === userId);
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    const updates = req.body;
    todos[todoIndex] = { ...todos[todoIndex], ...updates, updatedAt: new Date() };
    
    res.json(todos[todoIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle todo
router.patch('/:id/toggle', auth, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).userId;
    const todoId = req.params.id;
    
    const todoIndex = todos.findIndex(todo => todo._id === todoId && todo.userId === userId);
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todos[todoIndex].completed = !todos[todoIndex].completed;
    todos[todoIndex].updatedAt = new Date();
    
    res.json(todos[todoIndex]);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete todo
router.delete('/:id', auth, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).userId;
    const todoId = req.params.id;
    
    const todoIndex = todos.findIndex(todo => todo._id === todoId && todo.userId === userId);
    if (todoIndex === -1) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    todos.splice(todoIndex, 1);
    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get stats
router.get('/stats', auth, async (req: express.Request, res: express.Response) => {
  try {
    const userId = (req as any).userId;
    const userTodos = todos.filter(todo => todo.userId === userId);
    
    const total = userTodos.length;
    const completed = userTodos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const overdue = userTodos.filter(todo => 
      !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date()
    ).length;

    res.json({
      total,
      completed,
      pending,
      overdue
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;