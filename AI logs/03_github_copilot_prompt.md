Prompt for GitHub Copilot (Backend Integration + Sync)

Paste this in your main.py (or in a new README_DEV.md to guide Copilot):

GitHub Copilot Prompt

I am building a Campus Event Management Platform with two frontends:

Admin Portal (React + Tailwind) → for college admins to create/manage events, view reports.

Student Mobile App (React Native + Expo) → for students to browse events, register, check-in, and give feedback.

Both frontends must connect to the same FastAPI backend with a shared database (SQLite for local, Postgres for production).

Requirements for Copilot to Implement:

Ensure all backend endpoints (/users, /auth, /events, /participation, /reports) are connected to the database using SQLAlchemy.

Add role-based access control:

role="admin" → can POST/PUT/DELETE /events, access /reports/*.

role="student" → can only register, check-in, and give feedback via /participation/*.

Configure CORS middleware so both React (Admin) and React Native (Student) apps can call APIs without issues.

Make sure that when an Admin creates an event, it is immediately queryable via GET /events/ so Students see it.

Implement DB relationships correctly:

A User belongs to a College.

An Event belongs to a College.

A Student can only register for events in their own college.

An Admin can only manage events in their own college.

Seed script: generate sample data → 2 colleges, 1 admin per college, 10 students per college, 3 events per college.

Update /events/ endpoint to filter results by college_id from the logged-in user’s JWT.

Add last_updated timestamps on events → so frontends can refresh only when data changes.

Write unit tests (pytest) for:

Admin creating an event

Student registering/checking in

Reports API returning correct data

Ensure the backend can run locally with:

uvicorn app.main:app --reload

and connects to the correct SQLite DB file (campus.db).

Expected Behavior:

Admin creates an event → Students instantly see it when they refresh Events page.

Students register → Admin can see their names in Registrations list.

Attendance and Feedback reflect correctly in Reports.

Please scaffold missing code (CRUD, routers, role checks, seed script) and ensure clean, working code.
