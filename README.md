# Jiseti Frontend

Jiseti is a civic reporting platform that allows citizens to report corruption and request government intervention on public issues.

This repository contains the **frontend** of the Jiseti application, built with **React** and **Redux Toolkit**.

## Features

The frontend currently includes:

* User registration
* User login
* JWT-ready authentication flow
* User dashboard
* Create Red-Flag reports
* Create Intervention reports
* View submitted reports
* View report details
* Profile page
* Notifications page
* Admin dashboard
* Admin report review
* Report status display
* Responsive layout
* Geolocation/map support
* Draft report workflow

## Report Types

Jiseti supports two main types of reports:

### Red-Flag

A Red-Flag is used to report incidents related to corruption, such as:

* Bribery
* Misuse of public funds
* Abuse of office
* Fraud
* Corrupt public processes

### Intervention

An Intervention report is used to request government action on public issues, such as:

* Damaged roads
* Flooding
* Collapsed bridges
* Broken drainage systems
* Public infrastructure problems

## Report Statuses

Reports can have one of the following statuses:

```text
DRAFT
UNDER INVESTIGATION
REJECTED
RESOLVED
```

A report starts as:

```text
DRAFT
```

While a report is still in `DRAFT`, the owner can:

* Edit the title
* Edit the description
* Change the location
* Add supporting media
* Delete the report

Once an administrator changes the status, the report becomes locked and can only be viewed by the owner.

## Technologies Used

* React
* Vite
* Redux Toolkit
* React Redux
* React Router
* CSS
* Leaflet / React-Leaflet for maps
* OpenStreetMap

## Project Structure

```text
src/
│
├── assets/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── reports/
│   └── admin/
│
├── features/
│   ├── auth/
│   ├── reports/
│   ├── notifications/
│   └── users/
│
├── pages/
│   ├── public/
│   ├── auth/
│   ├── user/
│   └── admin/
│
├── routes/
│   ├── ProtectedRoute.jsx
│   └── AdminRoute.jsx
│
├── services/
│
├── store/
│   └── store.js
│
├── styles/
│
├── App.jsx
└── main.jsx
```

## Main Pages

### Public Pages

```text
/
```

Landing page

```text
/login
```

Login page

```text
/register
```

Registration page

### User Pages

```text
/dashboard
```

User dashboard

```text
/reports
```

User reports

```text
/reports/new
```

Create a new report

```text
/reports/:id
```

View report details

```text
/profile
```

User profile

```text
/notifications
```

Notifications

### Admin Pages

```text
/admin
```

Admin dashboard

```text
/admin/reports/:id
```

Admin report review page

## Installation

Clone the repository:

```bash
git clone <your-frontend-repository-url>
```

Move into the project folder:

```bash
cd jiseti-frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will display a local development URL such as:

```text
http://localhost:5173
```

Open it in your browser.

## Build for Production

To create a production build:

```bash
npm run build
```

To preview the production build:

```bash
npm run preview
```

## Geolocation

The New Report page allows users to select a report location using a map.

The application can store:

```text
location_name
latitude
longitude
```

For example:

```json
{
  "location_name": "Westlands, Nairobi",
  "latitude": -1.2676,
  "longitude": 36.8108
}
```

The user can work with the actual area name while the application stores the coordinates for the map.

## Authentication

The frontend is designed to use JWT authentication.

After a successful login or registration, the Flask backend will return a JWT token.

The frontend will send the token to protected backend routes using:

```text
Authorization: Bearer <JWT_TOKEN>
```

## Backend Integration

The frontend is intended to communicate with a separate Flask backend repository.

Architecture:

```text
React Frontend
      ↓
Redux Toolkit
      ↓
Flask REST API
      ↓
PostgreSQL
```

The backend will provide endpoints for:

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/reports
POST   /api/reports
GET    /api/reports/:id
PUT    /api/reports/:id
DELETE /api/reports/:id

GET    /api/admin/reports
PATCH  /api/admin/reports/:id/status
```

## Admin Rules

Admins can:

* View all reports
* Filter reports
* View report details
* Change report status

Admins cannot:

* Edit the user's report title
* Edit the user's report description
* Delete the user's report

## User Permissions

A regular user can edit or delete a report only when:

```text
status === "DRAFT"
```

A user can delete a report only when:

```text
user is the creator
AND
status === "DRAFT"
```

## Future Improvements

Possible additional features include:

* Image uploads
* Video uploads
* Email notifications
* SMS notifications
* Search by area name
* Reverse geocoding
* Report filters
* Report statistics
* Improved admin analytics

## Testing

The frontend project specification uses Jest for frontend testing.

Tests can be added for:

* Components
* Redux slices
* Authentication behavior
* Protected routes
* Report permissions
* Admin functionality

## Project Purpose

Jiseti aims to provide a simple and accessible platform where citizens can report corruption and request government intervention, helping improve accountability, transparency, and public service delivery.
