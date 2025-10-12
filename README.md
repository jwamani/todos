# Todo Application

A full-stack todo management application with user authentication, built with FastAPI and Preact/React.

## Features

### Core Functionality

- **User Authentication** - Secure registration and login with JWT tokens
- **CRUD Operations** - Create, read, update, and delete todos
- **Priority Management** - Three priority levels (High, Medium, Low) for tasks
- **Task Filtering** - View all, active, or completed tasks
- **Real-time Updates** - Optimistic UI updates for instant feedback
- **Responsive Design** - Works seamlessly on desktop and mobile

### Technical Features

- RESTful API with FastAPI
- JWT-based authentication with OAuth2
- SQLite database with SQLAlchemy ORM
- Password hashing with Argon2
- Comprehensive error handling
- CORS middleware for frontend integration

## Tech Stack

### Backend

- **Framework**: FastAPI
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT (python-jose) + OAuth2
- **Password Hashing**: Argon2 (via passlib)
- **Validation**: Pydantic schemas

### Frontend

- **Framework**: Preact with TypeScript
- **Styling**: Tailwind CSS v4
- **Routing**: preact-router
- **HTTP Client**: Axios
- **Icons**: lucide-preact
- **Build Tool**: Vite

## Project Structure

```txt
todo_application/
├── backend/
│   ├── main.py           # API routes and startup
│   ├── models.py         # Database models
│   ├── schemas.py        # Pydantic schemas
│   ├── database.py       # Database connection
│   ├── crud.py           # Database operations
│   ├── security.py       # JWT and password handling
│   ├── requirements.txt  # Python dependencies
│   ├── .env             # Environment variables
│   └── Dockerfile       # Backend container config
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── api/         # API client
│   │   ├── context/     # Auth context
│   │   └── hooks/       # Custom hooks
│   ├── package.json     # Node dependencies
│   └── Dockerfile       # Frontend container config
└── docker-compose.yml   # Container orchestration
```

## Installation & Setup

### Option 1: Docker (Recommended)

**Prerequisites**: Docker Desktop installed

```bash
# Build containers
docker-compose build

# Start application
docker-compose up

# Access:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Option 2: Manual Setup

**Backend Setup**:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Create .env file with:
# SECRET_KEY=your-secret-key
# ALGORITHM=HS256
# ACCESS_TOKEN_EXPIRE_MINUTES=30

uvicorn main:app --reload
```

**Frontend Setup**:

```bash
cd frontend
npm install
npm run dev
```

## API Endpoints

### Authentication

- `POST /token` - Login (returns JWT token)
- `POST /users` - Register new user

### Todos

- `GET /todos` - Get all user's todos
- `GET /todos/{id}` - Get specific todo
- `POST /todos` - Create new todo
- `PUT /todos/{id}` - Update todo
- `DELETE /todos/{id}` - Delete todo

All todo endpoints require JWT authentication via Bearer token.

## Usage

1. **Register** - Create an account with email and password
2. **Login** - Authenticate to receive JWT token
3. **Create Todos** - Add tasks with title, description, and priority
4. **Manage Tasks** - Mark complete, edit, delete, or filter tasks
5. **Logout** - Clear session and return to home

## Environment Variables

### Backend (.env)

```env
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (optional)

```env
VITE_API_URL=http://localhost:8000
```

## Database Schema

### Users Table

- `id` (Integer, Primary Key)
- `email` (String, Unique)
- `hashed_password` (String)

### Todos Table

- `id` (Integer, Primary Key)
- `title` (String, max 100 chars)
- `description` (String, max 500 chars)
- `priority` (Integer: 1=High, 2=Medium, 3=Low)
- `completed` (Boolean, default False)
- `owner_id` (Foreign Key to Users)
- `created_at` (DateTime with timezone)
- `updated_at` (DateTime with timezone, nullable)

## Security Features

- Password hashing with Argon2 (industry-standard)
- JWT token authentication with expiration
- Protected API endpoints requiring authentication
- CORS configuration for frontend access
- SQL injection prevention via ORM
- Input validation with Pydantic

## Development Notes

- Backend uses Uvicorn with auto-reload for development
- Frontend uses Vite with HMR (Hot Module Replacement)
- SQLite database file persists in `backend/todos.db`
- Optimistic UI updates for instant user feedback
- Comprehensive error handling with user-friendly messages

## License

This project is created for educational purposes.
