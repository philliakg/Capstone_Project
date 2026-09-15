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
