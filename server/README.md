# Campus Spark FastAPI Backend

A modern FastAPI backend for the Campus Spark Event Management System with role-based access control and PostgreSQL database.

## Features

- **Role-based Access Control**: Separate endpoints for admins and students
- **College-based Data Isolation**: All data is filtered by college_id
- **Real-time Event Management**: Admins can create events, students can register immediately
- **Comprehensive Event Lifecycle**: Registration → Check-in → Feedback → Reports
- **CORS Enabled**: Frontend applications can connect from any origin
- **Secure Authentication**: JWT-based authentication with proper password hashing
- **Database Relationships**: Proper foreign keys and relationships between all entities
- **Auto-sync**: Event registrations and attendance are automatically reflected in reports

## Database Schema

### Core Entities
- **Colleges**: Institution-level data
- **Users**: Students, admins, and faculty with college affiliation
- **Events**: College-specific events with organizer and capacity management
- **Registrations**: Student event registrations with status tracking
- **Feedback**: Student feedback on attended events

### Relationships
- Users belong to a College
- Events belong to a College and have an Organizer (User)
- Registrations link Students (Users) to Events
- Feedback links Students to Events they attended

## API Endpoints

### Authentication (`/auth`)
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/colleges` - List all colleges

### Admin Portal (`/admin`)
- `GET /admin/dashboard` - Dashboard statistics
- `GET /admin/events` - List college events
- `POST /admin/events` - Create new event
- `PUT /admin/events/{id}` - Update event
- `DELETE /admin/events/{id}` - Delete event
- `GET /admin/events/{id}/registrations` - Event registrations
- `PUT /admin/registrations/{id}/checkin` - Check-in student
- `GET /admin/students` - List college students
- `GET /admin/reports/events` - Event reports with analytics
- `GET /admin/feedback` - View all feedback

### Student App (`/student`)
- `GET /student/profile` - User profile
- `GET /student/events` - Available events
- `POST /student/events/{id}/register` - Register for event
- `DELETE /student/events/{id}/register` - Cancel registration
- `GET /student/registrations` - My registrations
- `POST /student/events/{id}/feedback` - Submit feedback
- `GET /student/events/history` - Attended events

### Events (`/events`)
- `GET /events/` - All events (filtered by college)
- `GET /events/upcoming` - Upcoming events
- `GET /events/popular` - Popular events by registration count
- `GET /events/categories` - Available categories
- `GET /events/{id}` - Event details

## Setup Instructions

### Prerequisites
- Python 3.8+
- PostgreSQL database
- pip (Python package manager)

### Installation

1. **Clone the repository**
   ```bash
   cd server
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up PostgreSQL database**
   ```sql
   CREATE DATABASE campus_spark;
   CREATE USER campus_user WITH PASSWORD 'campus_password';
   GRANT ALL PRIVILEGES ON DATABASE campus_spark TO campus_user;
   ```

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your database credentials:
   ```
   DATABASE_URL=postgresql://campus_user:campus_password@localhost/campus_spark
   SECRET_KEY=your-very-secure-secret-key-here
   ```

5. **Initialize database**
   ```bash
   # Create tables and seed data
   python seed.py
   ```

6. **Run the server**
   ```bash
   python main.py
   ```

The API will be available at `http://localhost:8000`

### API Documentation
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Sample Accounts

After running the seed script, you can use these accounts:

### Admin Accounts
- **Tech University**: `admin@techuniv.edu` / `admin123`
- **Business Institute**: `admin@bizinst.edu` / `admin123`

### Student Accounts
- **Tech University**: `alice@techuniv.edu` / `student123`
- **Tech University**: `bob@techuniv.edu` / `student123`
- **Business Institute**: `carol@bizinst.edu` / `student123`

## Frontend Integration

### CORS Configuration
The backend is configured to accept requests from:
- `http://localhost:3000` (React development)
- `http://localhost:5173` (Vite development)
- `http://localhost:8080` (Production build)

### Authentication Flow
1. Call `/auth/login` with email/password
2. Receive JWT token in response
3. Include token in Authorization header: `Bearer <token>`
4. Use role-specific endpoints based on user role

### Real-time Sync
- When admin creates an event, it's immediately available to students
- Student registrations update event counts in real-time
- Check-ins are reflected in attendance reports immediately
- All data is filtered by college_id automatically

## Development

### Database Migrations
Using Alembic for database migrations:

```bash
# Create a migration
alembic revision --autogenerate -m "Description"

# Apply migrations
alembic upgrade head

# Rollback migrations
alembic downgrade -1
```

### Adding New Features
1. Update models in `models.py`
2. Create/update schemas in `schemas.py`
3. Add routes in appropriate router files
4. Update authentication/authorization as needed
5. Create database migration if schema changed

## Production Deployment

1. Set proper environment variables
2. Use a production WSGI server like Gunicorn
3. Set up proper SSL/TLS
4. Configure production database
5. Set up proper logging and monitoring

```bash
# Example production command
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```
