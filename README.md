# Campus Event Platform

A comprehensive event management solution built for educational institutions. The platform features two portals (Admin & Student), mock authentication for demo purposes, and a full-stack architecture ready for production deployment.

## Key Features

- **Login System**: Demo authentication with fixed credentials, ready for real integration.
- **Event Management**: Full CRUD functionality to create, update, and delete campus events.
- **Dual Portals**: Segregated admin and student portals for distinct functionality.
- **Analytics Dashboard**: Real-time display of participation, attendance, and event popularity.
- **Registration System**: Students can register for events, check in, and track attendance.

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Shadcn/ui
- **Backend**: FastAPI + SQLAlchemy (backend implemented and ready to integrate)
- **State Management**: React Query + LocalStorage
- **Authentication**: JWT-based mock login system
- **Database**: Schema designed for SQLite/PostgreSQL

## Quick Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```

The app is available at http://localhost:8080

## Demo Credentials

| Role   | Email                  | Password   | Portal         |
|--------|------------------------|------------|----------------|
| Admin  | admin@campus.edu       | admin123   | /login         |
| Student| student@campus.edu     | student123 | /student/login |

## Dual Portal Architecture

### Admin Portal (/login → /dashboard)

Everything admins need to manage campus events:

- **Dashboard**: General overview with analytics and key statistics.
- **Event Management**: Create, edit, delete, and monitor events.
- **User Administration**: Add/manage students, staff, and permissions.
- **Registration Control**: View and manage student registrations.
- **Reports & Analytics**: Monitor attendance, popularity, and participation.
- **Settings**: System preference settings.

### Student Portal (/student/login → /student)

Student event discovery and participation features:

- **Home Dashboard**: Personal statistics and upcoming events.
- **Event Discovery**: Browse and search all campus events.
- **My Registrations**: Track your sign-ups.
- **Check-in System**: QR code or manual check-in for events.
- **Feedback System**: Review and rate attended events.
- **Profile**: Manage personal information and participation history.

## Portal Routes & Features

### Admin Routes

- `/login`: Admin login page
- `/dashboard`: Overview & analytics
- `/events`: Event management and creation
- `/users`: Student/faculty account management
- `/registrations`: View of all registrations
- `/attendance`: Event attendance tracking
- `/reports`: Generation of detailed reports

### Student Routes

- `/student/login`: Student login page
- `/student`: Student dashboard
- `/student/events`: Event discovery & search
- `/student/registrations`: Sign-ups management
- `/student/profile`: Personal profile & stats

## Current Implementation

- **Frontend**: Fully operational with mock data
- **Authentication**: Demo credentials integrated with JWT mock system
- **Backend**: API structure and routes defined (FastAPI-ready)
- **Database**: Schema structured for SQLite/PostgreSQL
- **Deployment**: Production-ready with environment-based configuration

A contemporary platform that simplifies event management for admins and engages students—created with cutting-edge web technologies.