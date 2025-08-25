# Todo Microservices Application

A full-stack todo application built with Node.js/TypeScript backend and React.js/TypeScript frontend, featuring JWT authentication and MongoDB database.

## 🚀 Features

### Backend Features
- **Authentication**: Email/password login with JWT tokens
- **User Management**: User registration and profile management
- **Todo CRUD Operations**: Create, read, update, delete todos
- **Advanced Filtering**: Filter by completion status, priority, search text
- **Pagination**: Efficient todo listing with pagination
- **Statistics**: Todo completion statistics and overdue tracking
- **Priority System**: High, medium, low priority levels
- **Due Dates**: Set and track due dates with overdue detection
- **Security**: Helmet, CORS, input validation, password hashing

### Frontend Features
- **Modern React**: Built with React 18 and TypeScript
- **Responsive UI**: TailwindCSS for modern, responsive design
- **Authentication Flow**: Login/register with form validation
- **Protected Routes**: Route protection for authenticated users
- **Real-time Updates**: Instant UI updates for todo operations
- **Advanced Filtering**: Filter todos by status, priority, and search
- **Statistics Dashboard**: Visual overview of todo statistics
- **Error Handling**: Comprehensive error handling with user feedback

## 🏗️ Architecture

```
todo-app/
├── backend/                 # Node.js/TypeScript API
│   ├── src/
│   │   ├── models/         # MongoDB models (User, Todo)
│   │   ├── routes/         # API routes (auth, todos)
│   │   ├── middleware/     # Authentication & error handling
│   │   ├── utils/          # JWT utilities
│   │   └── server.ts       # Express server setup
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React/TypeScript UI
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── contexts/       # React contexts (Auth)
│   │   ├── services/       # API service layer
│   │   ├── types/          # TypeScript interfaces
│   │   └── App.tsx         # Main app component
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## 🛠️ Prerequisites

- **Node.js** >= 18.x (LTS)
- **npm** >= 9.x
- **MongoDB** >= 5.x (running locally or MongoDB Atlas)
- **Git** for version control

## ⚡ Quick Start

### 1. Clone the Repository

```bash
# Clone from your GitHub repository
git clone https://github.com/HeshamSayed/todo-app.git
cd todo-app
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/todoapp
# JWT_SECRET=your-super-secret-jwt-key
# PORT=5000

# Start development server
npm run dev
```

The backend will start on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Open new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will start on `http://localhost:3000`

### 4. Database Setup

Make sure MongoDB is running:

```bash
# For local MongoDB
mongod

# Or use MongoDB Atlas (cloud)
# Update MONGODB_URI in backend/.env with your Atlas connection string
```

## 🔧 Environment Configuration

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/todoapp
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📚 API Documentation

### Authentication Endpoints

#### POST /api/auth/register
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login with email and password
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/me
Get current user info (requires authentication)

### Todo Endpoints

#### GET /api/todos
Get user's todos with optional filtering
- Query params: `page`, `limit`, `completed`, `priority`, `search`

#### POST /api/todos
Create a new todo
```json
{
  "title": "Complete project",
  "description": "Finish the todo app",
  "priority": "high",
  "dueDate": "2024-12-31"
}
```

#### PUT /api/todos/:id
Update a todo

#### DELETE /api/todos/:id
Delete a todo

#### PATCH /api/todos/:id/toggle
Toggle todo completion status

#### GET /api/todos/stats/summary
Get todo statistics (total, completed, pending, overdue)

## 🚀 Production Deployment

### Backend Deployment

1. **Build the application**:
   ```bash
   cd backend
   npm run build
   ```

2. **Set production environment variables**:
   ```env
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=your-production-mongodb-uri
   JWT_SECRET=your-production-jwt-secret
   ```

3. **Start the production server**:
   ```bash
   npm start
   ```

### Frontend Deployment

1. **Build the application**:
   ```bash
   cd frontend
   npm run build
   ```

2. **Deploy the `build/` folder** to your hosting service (Netlify, Vercel, etc.)

3. **Update API URL** for production in `.env`:
   ```env
   REACT_APP_API_URL=https://your-api-domain.com/api
   ```

## 🧪 Development Scripts

### Backend
```bash
npm run dev      # Start development server with hot reload
npm run build    # Build TypeScript to JavaScript
npm start        # Start production server
```

### Frontend
```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
npm run eject    # Eject from Create React App (irreversible)
```

## 🔐 Security Features

- **Password Hashing**: Uses bcryptjs with salt rounds
- **JWT Authentication**: Stateless authentication with expirable tokens
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for cross-origin requests
- **Helmet**: Security headers for Express
- **Environment Variables**: Sensitive data stored in environment variables

## 📱 Technology Stack

### Backend
- **Node.js** - JavaScript runtime
- **TypeScript** - Type-safe JavaScript
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Helmet** - Security middleware
- **CORS** - Cross-origin resource sharing
- **Morgan** - HTTP request logger

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **React Router** - Client-side routing
- **TailwindCSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **Context API** - State management

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

- TailwindCSS may need manual configuration in some environments
- MongoDB connection issues on first run - ensure MongoDB is running
- CORS issues if frontend and backend ports don't match environment variables

## 📞 Support

For support, email heshamsayed.dev@gmail.com or create an issue in this repository.

## 🚧 Roadmap

- [ ] Add todo categories/tags
- [ ] Implement todo sharing between users
- [ ] Add file attachments to todos
- [ ] Email notifications for overdue todos
- [ ] Dark mode toggle
- [ ] Mobile app with React Native
- [ ] API rate limiting
- [ ] Advanced search with filters
- [ ] Todo templates
- [ ] Bulk operations (delete, update multiple todos)

---

---

**Developer**: Hesham Sayed  
**Email**: heshamsayed.dev@gmail.com  
**GitHub**: [HeshamSayed](https://github.com/HeshamSayed)

**Built with ❤️ using Node.js, TypeScript, React, and MongoDB**