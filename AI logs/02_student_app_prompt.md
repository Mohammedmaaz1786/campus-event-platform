Prompt for Lovable/v0 (Student Participant App)

Build a modern Student Mobile App for a Campus Event Management Platform using React Native (Expo) + Tailwind CSS.

🎨 UI/UX Requirements (consistent with Admin Portal):

Use the same color palette and typography as the Admin Dashboard.

Clean, minimal layout with bottom navigation tabs: Home, Events, My Registrations, Profile.

Use cards and list views for events and registrations.

Forms should use rounded inputs, floating labels, and primary/secondary buttons consistent with Admin Portal.

Responsive for mobile screens.

📱 Pages & Features:

Login / Register Page

Clean login form with app logo.

Registration form for new students (name, email, password, college).

Calls backend APIs:

POST /auth/login (login)

POST /users/ (student registration).

Home (Dashboard)

Welcome message with student’s name.

Quick stats cards:

"Events Registered"

"Events Attended"

"Feedbacks Given"

Small chart preview (use Recharts) for student’s participation trend.

Events Page

List of upcoming events (title, venue, start_time, end_time).

Each event card has a Register / Cancel button.

Calls backend APIs:

GET /events/

POST /participation/register

DELETE /participation/register (optional).

My Registrations Page

List of events the student registered for.

Each event card has a Check-in button (for attendance).

After the event end, show a Give Feedback button.

Calls backend APIs:

POST /participation/checkin

POST /participation/feedback.

Profile Page

Show student info (name, email, college).

Option to logout.

⚙️ Technical Setup:

Use Axios for API calls, with a global api.js file.

Axios interceptor should attach Authorization: Bearer <token> from AsyncStorage.

Use React Navigation (bottom tabs) for page navigation.

Code structure:

screens/ → LoginScreen.jsx, HomeScreen.jsx, EventsScreen.jsx, MyRegistrationsScreen.jsx, ProfileScreen.jsx

components/ → EventCard.jsx, StatCard.jsx, ChartCard.jsx

Use Tailwind for consistent UI (same style as Admin Portal).

🎯 Goal: Deliver a polished, modern student app that feels consistent with the Admin Dashboard but focuses on event browsing, participation, and feedback.
