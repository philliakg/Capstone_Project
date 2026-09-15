# Capstone Project — Accommodation Booking App

A full-stack accommodation booking application with a guest website, a host/admin dashboard, and a shared API. The two websites use React and Vite; the backend uses Node.js, Express, and MongoDB with Mongoose.

## Try the deployed project

No local installation is required to use the deployed websites.

| Application | Link | Email | Password |
| --- | --- | --- | --- |
| Admin / host dashboard | [Open admin dashboard](https://kgabocapstoneadmin.onrender.com) | `kgabo@gmail.com` | `password321` |
| Frontend / guest website | [Open guest website](https://kgabocapstonefrontend.onrender.com) | `phillia@gmail.com` | `password123` |

Enter the emails in lowercase as shown above. These are the supplied Kgabo and Phillia demo accounts; the backend stores their emails in lowercase and login currently matches them exactly.

- **Admin:** Open the dashboard and log in with the host account to manage accommodation listings and view reservations.
- **Guest:** Open the guest website, choose **Log in**, and use the guest account to browse accommodation and make reservations.

## Project structure

```text
Capstone_Project/
├── admin/       # React host/admin dashboard
├── backend/     # Express API, database models, and uploaded images
├── frontend/    # React guest website
└── README.md
```

## Run locally

### 1. Prerequisites

- Node.js 22.12 or newer with npm.
- A running local MongoDB server or a MongoDB Atlas connection string for a development database.
- A downloaded or cloned copy of this repository.

Run the commands below from the project root unless a step says otherwise. Each application has its own dependencies and scripts; the root package does not start the applications.

### 2. Install dependencies

```sh
npm install --prefix backend
npm install --prefix frontend
npm install --prefix admin
```

### 3. Configure the backend

Create or update `backend/.env` with your local configuration:

```dotenv
PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/capstone_project
SECRET=replace-with-a-long-random-secret
```

- `PORT`: Port for the API server.
- `MONGO_URI`: Your development MongoDB connection string. Replace the example if using Atlas.
- `SECRET`: Secret used to sign login tokens. Set your own value and keep the `.env` file out of version control.

The backend connects to MongoDB before it starts listening. On startup, it creates or updates the two demo accounts above, resetting their passwords to the supplied values. It also adds sample accommodation listings when the listings collection is empty.

### 4. Connect both websites to the local API

In both `frontend/src/api.js` and `admin/src/api.js`, replace the existing `API_URL` declaration with:

```js
export const API_URL = 'http://localhost:4000'
```

The repository currently points both apps to `https://kgabocapstonebackend.onrender.com`. Changing these declarations makes local browsing and reservations use your local backend and development database. If you change the backend port, update both URLs to match.

### 5. Start the three applications

Keep each command running in a separate terminal, starting from the project root.

**Terminal 1 — Backend**

```sh
cd backend
npm run dev
```

Wait for `connected to db` and `listening on port 4000`. Use `npm start` instead if you do not need automatic restarts when backend files change.

**Terminal 2 — Guest website**

```sh
cd frontend
npm run dev -- --port 5173
```

Open [the local guest website](http://localhost:5173).

**Terminal 3 — Admin dashboard**

```sh
cd admin
npm run dev -- --port 5174
```

Open [the local admin dashboard](http://localhost:5174).

Use the demo credentials listed above. If a requested website port is already in use, Vite may select another port; open the URL printed in that terminal. Press `Ctrl+C` in each terminal to stop the applications.

## Build and preview

Run these commands from the project root to build both React applications:

```sh
npm run build --prefix frontend
npm run build --prefix admin
```

Build output is written to `frontend/dist` and `admin/dist`. The API URL in each app is included in its build, so configure it before building.

Preview the builds in separate terminals:

```sh
npm run preview --prefix frontend -- --port 4173
npm run preview --prefix admin -- --port 4174
```

The configured backend must also be running for login, listings, and reservations to work.

## Troubleshooting

- **Backend does not start listening:** Check `backend/.env`, ensure MongoDB is running or Atlas is accessible, and read the backend terminal error.
- **Listings or login fail locally:** Check that both `src/api.js` files point to the running backend and use the same port as `backend/.env`.
- **Incorrect email:** Enter the demo email in lowercase without leading or trailing spaces.
- **Admin access is rejected:** Use the Kgabo host account. The Phillia guest account cannot access the admin dashboard.
- **Node.js compatibility error:** Check `node --version` and use Node.js 22.12 or newer.
