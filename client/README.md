Project Name:- Role-Based Access-Control (RBAC).

Description:- This project implements Role-Based Access Control (RBAC), where different users are assigned different roles, and each role has specific permissions. The purpose of RBAC is to manage access control, providing users with access to different parts of the application based on their role.

Features:-
Multiple roles: Admin, User, etc.
Role-based permissions: Read, Write, Update, Delete (CRUD).
User authentication and authorization.
Flexible permissions system.
Easy to integrate with any web application.

Prerequisites
To run this project, you need to have the following installed on your system:

Node.js & npm (Node Package Manager)
MongoDB
Express.js
React 
Cors

rbac-mern-project/
│
├── client/                  # React frontend
│   ├── public/
│   ├── src/
│   ├── package.json         # Frontend dependencies
│
├── server/                  # Node.js/Express backend
│   ├── models/              # MongoDB models (User, Role, etc.)
│   ├── config/              # Configuration files (DB, JWT secret)
│   ├── index.js            # Main entry point for backend
│   ├── package.json         # Backend dependencies
│
└── README.md                # Project documentation


Installation:-
Clone the Repository:

git clone https://github.com/ratharathor/rbac.git
cd rbac-project
