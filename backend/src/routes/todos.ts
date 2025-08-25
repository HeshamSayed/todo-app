import express, { Response } from 'express';
import Todo from '../models/Todo';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all todos for the authenticated user
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, completed, priority, search } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    // Build filter
    const filter: any = { userId: req.userId };
    
    if (completed !== undefined) {
      filter.completed = completed === 'true';
    }
    
    if (priority && priority !== 'all') {
      filter.priority = priority;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const todos = await Todo.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Todo.countDocuments(filter);

    res.json({
      todos,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get todos error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a single todo
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });
    
    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    console.error('Get todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new todo
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, priority, dueDate } = req.body;

    if (!title || title.trim().length === 0) {
      res.status(400).json({ message: 'Title is required' });
      return;
    }

    const todoData: any = {
      title: title.trim(),
      userId: req.userId
    };

    if (description) todoData.description = description.trim();
    if (priority) todoData.priority = priority;
    if (dueDate) todoData.dueDate = new Date(dueDate);

    const todo = new Todo(todoData);
    await todo.save();

    res.status(201).json(todo);
  } catch (error) {
    console.error('Create todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a todo
router.put('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, completed, priority, dueDate } = req.body;

    const updateData: any = {};
    
    if (title !== undefined) {
      if (title.trim().length === 0) {
        res.status(400).json({ message: 'Title cannot be empty' });
        return;
      }
      updateData.title = title.trim();
    }
    
    if (description !== undefined) updateData.description = description.trim();
    if (completed !== undefined) updateData.completed = completed;
    if (priority !== undefined) updateData.priority = priority;
    if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;

    const todo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      updateData,
      { new: true, runValidators: true }
    );

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    res.json(todo);
  } catch (error) {
    console.error('Update todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a todo
router.delete('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.userId 
    });

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Delete todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle todo completion
router.patch('/:id/toggle', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, userId: req.userId });

    if (!todo) {
      res.status(404).json({ message: 'Todo not found' });
      return;
    }

    todo.completed = !todo.completed;
    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error('Toggle todo error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get todos statistics
router.get('/stats/summary', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [total, completed, pending, overdue] = await Promise.all([
      Todo.countDocuments({ userId: req.userId }),
      Todo.countDocuments({ userId: req.userId, completed: true }),
      Todo.countDocuments({ userId: req.userId, completed: false }),
      Todo.countDocuments({ 
        userId: req.userId, 
        completed: false,
        dueDate: { $lt: new Date() }
      })
    ]);

    res.json({
      total,
      completed,
      pending,
      overdue
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;