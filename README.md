# Event-it – Event Management System

## Project Description

Event-it is a full-stack web application used to manage university events.

The system supports three roles:

- Student – browse and join events
- Manager – create and manage events
- Admin – approve events and manage users

The frontend is built using React, and the backend uses Node.js, Express, and MongoDB.

---

## Technologies Used

Frontend:
- React.js
- React Router
- React Bootstrap

Backend:
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication

---

## How to Run the Project

### Run Backend

Open terminal:

cd backend  
npm install  
node server.js  

Backend runs on:  
http://localhost:5001

---

### Run Frontend

Open another terminal:

cd frontend  
npm install  
npm start  

Frontend runs on:  
http://localhost:3000

---
## Environment Variables

Create a .env file inside the backend folder and add:

MONGO_URI=your_mongodb_atlas_connection_string
PORT=5001
JWT_SECRET=your_secret_key

Note:
The .env file is not uploaded to GitHub for security reasons. The actual MONGO_URI is provided privately for grading/testing purposes.


Database

This project uses MongoDB Atlas as a cloud database.

The database is hosted online, so no local database export is required.

MongoDB Atlas Network Access has been configured to allow global access using:
0.0.0.0/0

This allows the application to connect from any machine during testing.

The database connection is handled through the MONGO_URI stored in the .env file.

---

## Main Features

- User registration and login  
- Role-based system (Student, Manager, Admin)  
- Event creation  
- Event approval  
- Event registration  
- Points system  

---

## Project Structure

frontend/ → React user interface  
backend/ → Express server  
backend/models → Database schemas  
backend/routes → API routes  
backend/controllers → Backend logic  
backend/middleware → Authentication and role checking  
