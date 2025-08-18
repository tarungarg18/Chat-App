# MyChat – Admin Panel
A lightweight React admin interface for managing the MyChat app. It lets an admin list users, delete a specific user, wipe all users, and clear all messages. Requests are authenticated by sending an admin key in the request header.

## Features

1. View all registered users

2. Delete a single user

3. Delete all users

4. Delete all messages

5. Sends x-admin-key with every admin request

## Tech Stack

Frontend: React, Axios

Backend (required): MyChat API (Node/Express, MongoDB)

Auth (admin): Shared header key (x-admin-key)

## Folder Structure
admin-panel/
<br>
  ├─ public/
  <br>
  ├─ src/
  <br>
  │   ├─ components/
  <br>
  │   ├─ pages/
  <br>
  │   ├─ utils/
  <br>
  │   └─ index.js
  <br>
  ├─ .env             
  <br>
  ├─ package.json
  <br>
  └─ README.md

## Prerequisites

Node.js 18+

A running MyChat backend URL (Render/Heroku/Railway/local)

An admin key configured on your backend (e.g., ADMIN_KEY)

## Environment Variables

Create admin-panel/.env:

### Backend base URL – REQUIRED if your code reads from env; 
### otherwise make sure src/utils/APIRoutes.js points to the correct URL.
REACT_APP_API_URL=https://your-backend.example.com

# Client-side admin key sent as x-admin-key
# (Match this with your backend’s ADMIN_KEY)
REACT_APP_ADMIN_KEY=change_this_admin_key


The panel sends x-admin-key: REACT_APP_ADMIN_KEY on admin routes:

GET /api/admin/users

DELETE /api/admin/delete-user/:userId

DELETE /api/admin/delete-all-users

DELETE /api/admin/delete-all-messages

Quick Start (Local)
cd admin-panel
npm install

## Development
npm start

## Production build
npm run build


Dev server: http://localhost:3001 (or the port shown in your terminal)

Ensure the backend is reachable from your browser and CORS is set up correctly on the API.

## Deployment
Vercel / Netlify (Static)

Build command: npm run build

Publish/Output directory: build

## Environment variables:

REACT_APP_API_URL

REACT_APP_ADMIN_KEY

SPA routing (if you use client-side routes):

Vercel: add vercel.json at admin-panel/ if needed:

{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}


Netlify: add _redirects with /* /index.html 200


## Security Notes

A static admin key in frontend code can be extracted by anyone with access to the panel. For production, prefer:

Putting admin endpoints behind a server-side proxy that adds the header,

Or using proper admin authentication (JWT/role-based) instead of a shared key.

Always use HTTPS URLs for the backend in production.

## Common Issues & Fixes

401/403 on admin routes: Admin key mismatch → check REACT_APP_ADMIN_KEY vs backend ADMIN_KEY.

CORS errors: Enable CORS for the admin origin in your backend.

Calls going to localhost in production: Ensure REACT_APP_API_URL is set in the deploy provider’s environment settings and rebuild.

## Scripts
"scripts": {
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
