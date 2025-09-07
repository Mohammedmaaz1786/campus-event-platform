# Campus Event Platform

A modern platform designed to streamline campus event management for colleges. Admins can effortlessly create, edit, and track events, while students can browse, register, and monitor their attendance. The platform ensures seamless synchronization between admins and students, providing live updates and personalized dashboards.

## Features

- **Event Management**: Admins can create, edit, and manage events in real time.
- **Student Engagement**: Students can view upcoming events, register, check in for attendance, and provide feedback.
- **Live Updates**: Real-time event updates and search functionality.
- **Cross-College Visibility**: Events are visible across participating colleges.
- **Dashboards**: Participation stats and individual dashboards for both admins and students.

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Backend**: FastAPI with SQLite (local) / Postgres (production)
- **Mobile**: React Native (Expo)

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
3. Visit `http://localhost:8080` in your browser.

## Login & Test Accounts

### Admin
- **Email**: `admin@campus.edu`
- **Password**: `admin123`
- **Login**: `/admin/login`

### Student
- **Email**: `john.doe@student.edu`
- **Password**: `student123`
- **Login**: `/student/login`

Additional test accounts are available in `ADMIN_STUDENT_CREDENTIALS.md`.

## Navigation

### Admin Portal (`/admin`)
- Dashboard
- Events
- Users
- Registrations
- Reports
- Profile

### Student Portal (`/student`)
- Home
- Events
- My Registrations
- Profile

## About

The Campus Event Platform simplifies event management for colleges, making it easier for admins to organize and for students to participate. With real-time updates, intuitive dashboards, and cross-college visibility, it fosters seamless collaboration and engagement.
