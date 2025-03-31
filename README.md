# Task Management API

## Overview

The **Task Management API** is a RESTful service that allows users to create, update, delete, and manage tasks efficiently. The API provides authentication and authorization, ensuring that users can only access and modify their own tasks.

## Features

- **User Authentication** (Signup, Login, Logout, Protected Routes)
- **Task Management** (CRUD operations on tasks)
- **Task Filtering** (By category, deadline, and completion status)
- **Task Completion Status Update**
- **Admin Privileges** (For managing tasks globally)

## Technologies Used

- **Node.js & Express.js** (Backend framework)
- **MongoDB & Mongoose** (Database & ODM)
- **JWT Authentication** (User security)
- **Moment.js** (Date handling)
- **Swagger** (API documentation)

## Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/Chioma-Okeke/task-management-app.git
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Create a **.env** file and add the following environment variables:

   ```env
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

4. Start the server:

   ```sh
   npm run dev
   ```

## API Endpoints

### Authentication

| Method | Endpoint       | Description                     |
| ------ | -------------- | ------------------------------- |
| POST   | `/auth/signup` | Register a new user             |
| POST   | `/auth/login`  | Authenticate user and get token |
| POST   | `/auth/logout` | Log out the authenticated user  |

### Tasks

| Method | Endpoint            | Description                              |
| ------ | ------------------- | ---------------------------------------- |
| GET    | `/tasks`            | Get all tasks for the authenticated user |
| GET    | `/tasks/:id`        | Get a specific task by ID                |
| POST   | `/task`             | Create a new task                        |
| PUT    | `/tasks/:id`        | Update an existing task                  |
| PUT    | `/tasks/:id/status` | Update task completion status            |
| DELETE | `/tasks/:id`        | Delete a task                            |

### Filtering Tasks

Tasks can be filtered using query parameters:

```sh
GET /tasks?categories=work&deadline=2025-04-01&status=true
```

## Future Enhancements

- Task prioritization (High, Medium, Low)
- Email notifications for task deadlines
- Role-based access control

