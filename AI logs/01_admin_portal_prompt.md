Prompt for Lovable/v0 (Admin Portal)


Build a modern Admin Dashboard for a Campus Event Management Platform using React + Tailwind CSS.

🎨 UI/UX Requirements:

Use a clean, minimal dashboard layout with a sidebar navigation and a top navbar.

Sidebar should have icons + labels: Dashboard, Events, Users, Registrations, Attendance, Reports.

Use cards to show quick stats (e.g., Total Events, Registered Students, Attendance %, Feedback Avg).

Use tables with pagination and hover effects for lists (Events, Users, Registrations).

Forms should have rounded input fields, floating labels, and primary/secondary button styles.

Use responsive design — works on desktop and tablet.

Use Recharts or Chart.js for analytics visualizations (bar chart, pie chart, line chart).

🖥️ Pages & Features:

Login Page

Professional login form with app logo/title.

Calls /auth/login API, stores JWT token in localStorage.

On success → redirect to dashboard.

Dashboard (Overview)

Show stat cards (Total Events, Students Registered, Attendance %, Avg Feedback).

Include a small bar chart of "Top 5 Popular Events".

Events Page

Table of events (columns: Title, Venue, Start, End, Status).

"Create Event" button opens a modal form with fields (title, description, venue, start_time, end_time).

API calls: GET /events/, POST /events/.

Users Page

Table with columns (Name, Email, Role, College).

API: GET /users/.

Registrations Page

Table: Event → Registered Students list.

Placeholder API now, later connect /events/{id}/registrations.

Attendance Page

Table of event check-ins (User, Event, Timestamp).

API: GET /events/{id}/attendance.

Reports Page

Three charts:

Event Popularity (bar chart of registrations per event)

Attendance % (pie chart)

Student Participation (line chart of events attended per student)

API placeholders: /reports/event-popularity, /reports/student-participation.

⚙️ Technical Setup:

Use Axios with an api.js file for all API calls.

Axios interceptor should attach Authorization: Bearer <token> from localStorage.

Use React Router for navigation.

Code structure:

pages/ → EventsPage.jsx, UsersPage.jsx, Dashboard.jsx, etc.

components/ → Sidebar.jsx, Navbar.jsx, StatCard.jsx, Table.jsx, ChartCard.jsx.

Tailwind classes for spacing, shadows, rounded corners.

Use dark mode toggle if possible.

🎯 Goal: Deliver a polished, modern dashboard UI that feels production-ready, while still simple to connect to the FastAPI backend.
