# 🎵 Topify

Topify is a backend-powered music platform where artists can upload songs and create albums, while users can explore and access music content. This project focuses on building a scalable and structured backend system, with future plans for frontend integration and music streaming capabilities.

---

## 🚀 Features

### 👤 Authentication
- User registration with username, email, and password
- Secure login & logout functionality
- Role-based access (`user` / `artist`)

### 🎤 Artist Capabilities
- Upload music files
- Create albums
- Associate songs with albums

### 🎧 User Capabilities
- Browse all available music
- View all albums
- Access album details

---

## 🛠️ Tech Stack

- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **Multer (for file uploads)**
- **ImageKit (for media storage)**

---

## 📁 Project Structure

Topify/ (will be updated later)

    │── src 
         │── app.js
     
         │── controllers/
     
         │── middleware/
     
         │── models/
     
         │── routes/
     
         │── services/

    │── server.js

---

## 📡 API Overview

### Auth
- Register user
- Login user
- Logout user

### Music & Album
- Upload music (Artist only)
- Create album (Artist only)
- Get all music (Authenticated users)
- Get all albums (Authenticated users)
- Get album by ID (Authenticated users)

---

## 📦 File Upload

- Music files are handled using **Multer**
- Stored using **ImageKit**

---

## 🔐 Role-Based Access

- **Artist**
- Upload music
- Create albums

- **User**
- Browse music
- View albums

---

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key

---

## ▶️ Running the Project

# Install dependencies
npm install

# Run server
npm start or num run dev 

---

## 📌 Current Status

* Backend core functionalities completed
* Authentication and authorization implemented
* Music upload and album management ready

---

## 🔜 Upcoming Updates

* Frontend integration
* Music streaming functionality
* UI/UX enhancements
* Advanced search & recommendation system

---

## 🤝 Contribution

This project is actively evolving. More commits and features will be added progressively.

---
