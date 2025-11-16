# Project Management Tool

> A comprehensive full-stack web application designed to streamline project and task management with role-based access control for managers and employees.

[![React](https://img.shields.io/badge/React-19.1.1-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-14%2B-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.0%2B-brightgreen.svg)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-5.1.0-lightgrey.svg)](https://expressjs.com/)

---

## 📋 Table of Contents

1. [Introduction](#introduction)
2. [Problem Statement & Solution](#problem-statement--solution)
3. [Features & Functionalities](#features--functionalities)
4. [System Requirements](#system-requirements)
5. [System Design & Architecture](#system-design--architecture)
6. [Technology Stack](#technology-stack)
7. [Installation & Setup](#installation--setup)
8. [Usage Guide](#usage-guide)
9. [API Documentation](#api-documentation)
10. [Testing](#testing)
11. [Limitations](#limitations)
12. [Future Enhancements](#future-enhancements)
13. [Contributing](#contributing)
14. [License](#license)

---

## 🎯 Introduction

### What We Built

The **Project Management Tool** is a modern, full-stack web application that serves as a centralized platform for managing projects, tasks, and team collaboration. Built using the MERN stack (MongoDB, Express.js, React, Node.js), this system provides distinct interfaces for managers and employees, enabling efficient project tracking, task assignment, and performance monitoring.

### Project Objectives

1. **Centralize Project Management**: Create a unified platform where managers can oversee multiple projects, allocate resources, and track progress in real-time
2. **Streamline Task Assignment**: Enable seamless task creation, assignment, and status tracking across project teams
3. **Role-Based Access Control**: Implement secure authentication with tailored interfaces for managers and employees
4. **Performance Analytics**: Provide insights into project progress, employee productivity, and deadline adherence
5. **Enhance Team Collaboration**: Facilitate better communication through organized project and task structures
6. **Document Management**: Support file uploads and attachments for comprehensive project documentation

### Scope of the Project

**What's Included:**
- Complete user authentication and authorization system
- Manager dashboard with project and team management capabilities
- Employee dashboard with personal task tracking and performance metrics
- RESTful API backend with Express.js
- MongoDB database with well-structured schemas
- Responsive React frontend with modern UI/UX
- File upload and management system
- Role-based routing and access control

**What's Not Included:**
- Native mobile applications
- Real-time chat/messaging
- Email notification system
- Third-party tool integrations (Slack, JIRA, etc.)
- Advanced data visualization and reporting
- Multi-language support

---

## 🔍 Problem Statement & Solution

### The Problem We Solved

Modern organizations face significant challenges in project and task management:

**Key Pain Points:**
1. **Lack of Centralized System**: Teams use multiple disconnected tools (emails, spreadsheets, chat apps) leading to information silos
2. **Poor Visibility**: Managers struggle to get real-time insights into project status and employee workload
3. **Inefficient Task Tracking**: Manual task assignment and status updates are time-consuming and error-prone
4. **Missed Deadlines**: No automated tracking or reminders for upcoming and overdue tasks
5. **Limited Accountability**: Difficulty in tracking who is responsible for what and measuring individual performance
6. **Resource Mismanagement**: Inability to see team capacity and workload distribution
7. **Communication Gaps**: Important project information scattered across various platforms

**Impact of These Problems:**
- Reduced team productivity
- Missed project deadlines
- Budget overruns
- Poor resource allocation
- Low employee accountability
- Management overhead

### Our Solution

We developed a **comprehensive web-based project management system** that addresses these challenges:

**✅ Centralized Platform**
- Single source of truth for all projects, tasks, and team information
- All project data accessible from one dashboard

**✅ Real-Time Visibility**
- Live project status updates
- Task progress tracking
- Performance metrics and analytics
- Upcoming and overdue deadline monitoring

**✅ Efficient Task Management**
- Quick task creation and assignment
- Priority levels (Low, Medium, High)
- Status tracking (To Do, In Progress, Completed)
- File attachments for task documentation

**✅ Role-Based Access**
- **Managers**: Full control over projects, tasks, and team assignments
- **Employees**: Focused view of personal tasks and responsibilities
- Secure authentication with JWT tokens

**✅ Performance Monitoring**
- Task completion rates
- On-time delivery metrics
- Individual and team performance dashboards
- Project budget tracking

**✅ Enhanced Accountability**
- Clear task ownership
- Transparent responsibility assignment
- Activity tracking and history

---

## ✨ Features & Functionalities

### 🔐 Authentication & Authorization

**User Registration & Login**
- Secure signup with encrypted password storage (bcrypt)
- JWT-based authentication with token expiration
- Role assignment (Manager/Employee)
- Session persistence with localStorage
- Automatic logout on token expiration
- Protected routes based on user roles

### 👨‍💼 Manager Module

#### **1. Dashboard**
- **Project Overview Cards**
  - Total projects count
  - Active projects
  - Completed projects
  - Pending projects
- **Task Statistics**
  - Total tasks across all projects
  - Tasks by status (To Do, In Progress, Completed)
  - Overdue tasks count
- **Upcoming Deadlines**
  - Tasks due within next 7 days
  - Sorted by due date
  - Quick status indicators
- **Performance Metrics**
  - Team productivity stats
  - Project completion rates
  - Budget utilization overview
- **Recent Activity**
  - Latest task updates
  - Recent project changes

#### **2. Project Management**

**Create Projects**
- Project name and description
- Client information
- Start and end dates
- Budget allocation
- Project status (Active, Completed, Pending)
- Team member assignment

**View Projects**
- List view of all projects
- Search functionality
- Filter by status (Active, Completed, Pending)
- Sort by date, name, or status
- Project cards with key metrics

**Edit Projects**
- Update project details
- Modify timeline
- Adjust budget
- Change project status
- Update team composition

**Delete Projects**
- Remove completed or cancelled projects
- Confirmation dialog for safety
- Cascading deletion handling

**Project Details View**
- Complete project information
- Assigned team members list
- All project tasks in table format
- Budget vs. spent tracking
- Project timeline visualization

#### **3. Task Management**

**Create Tasks**
- Task name and description
- Assign to specific employee from project team
- Set priority (Low, Medium, High)
- Define due date
- Associate with project
- Attach files/documents

**View Tasks**
- All tasks across projects
- Tasks by project
- Filter by status, priority, assignee
- Sort by due date, priority
- Search tasks

**Edit Tasks**
- Update task details
- Reassign to different employee
- Change priority level
- Modify due date
- Add/remove file attachments

**Delete Tasks**
- Remove obsolete tasks
- Confirmation required
- Updates project task count

**Task Monitoring**
- Real-time status updates
- Overdue task alerts
- Task completion tracking
- Employee workload view

#### **4. Team Management**

**View Employees**
- Complete employee directory
- Employee details:
  - Employee ID
  - Name and email
  - Role and department
  - Joining date
  - Contact information (phone, address)
  - Manager/Employee status
- Search employees
- Filter by department, role

**Assign Team Members**
- Add employees to projects
- Remove employees from projects
- View employee project assignments
- Check employee availability

**Performance Monitoring**
- Employee task completion rates
- On-time delivery percentage
- Workload distribution
- Individual performance metrics

#### **5. File Management**
- Upload project/task documents
- View uploaded files
- Download attachments
- File organization by project/task

### 👨‍💻 Employee Module

#### **1. Dashboard**

**Task Summary Cards**
- Total tasks assigned
- Tasks To Do
- Tasks In Progress
- Completed tasks
- Overdue tasks

**Upcoming Deadlines**
- Tasks due in next 7 days
- Today's due tasks highlighted
- Color-coded priority indicators

**Performance Metrics**
- Task completion rate
- On-time completion percentage
- Tasks completed this week
- Tasks completed this month

**Missed Deadlines**
- List of overdue tasks
- Days overdue indicator
- Priority levels

#### **2. Task Management**

**View Tasks**
- All assigned tasks
- Tasks organized by project
- Comprehensive task table with:
  - Task name
  - Project name
  - Status
  - Priority
  - Due date
  - Attached files

**Filter Tasks**
- By status (To Do, In Progress, Completed)
- By priority (Low, Medium, High)
- By project
- By due date

**Sort Tasks**
- By due date (ascending/descending)
- By priority
- By project name
- By status

**Update Task Status**
- Change status: To Do → In Progress → Completed
- Real-time status update
- Automatic dashboard refresh

**Upload Files**
- Attach documents to tasks
- Multiple file support
- File preview and download

#### **3. Profile Management**
- View personal information
- Update profile details
- Change contact information
- View assigned projects

### 🔄 Common Features

**Responsive Design**
- Mobile-friendly interface
- Tablet optimization
- Desktop layouts
- Touch-friendly controls

**Navigation**
- Sidebar navigation
- Breadcrumb trails
- Quick access menus
- Role-specific navigation items

**Search & Filter**
- Global search functionality
- Advanced filtering options
- Multiple sort criteria
- Saved filter preferences

**Security**
- JWT token authentication
- Password encryption
- Protected API endpoints
- Role-based access control
- CORS protection

**Error Handling**
- User-friendly error messages
- Form validation
- Server error handling
- Loading states
- Confirmation dialogs

---

## 💻 System Requirements

### Hardware Requirements

#### Minimum Configuration:
- **Processor**: Intel Core i3 (2.0 GHz) or equivalent
- **RAM**: 4 GB
- **Storage**: 10 GB available space
- **Display**: 1366 x 768 resolution
- **Network**: Stable internet connection (2 Mbps)

#### Recommended Configuration:
- **Processor**: Intel Core i5 (2.5 GHz) or higher
- **RAM**: 8 GB or more
- **Storage**: 20 GB SSD
- **Display**: 1920 x 1080 resolution or higher
- **Network**: High-speed broadband (10 Mbps+)

### Software Requirements

#### Operating System:
- Windows 10/11 (64-bit)
- macOS 10.15 or later
- Linux (Ubuntu 20.04 LTS or later)

#### Core Technologies:
- **Node.js**: v14.x or higher (v18.x recommended)
- **npm**: v6.x or higher
- **MongoDB**: v5.0+ (local) OR MongoDB Atlas (cloud)
- **Modern Web Browser**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

#### Development Tools:
- Visual Studio Code (recommended)
- Git for version control
- Postman or Thunder Client for API testing
- MongoDB Compass for database management

---

## 🏗️ System Design & Architecture

### Architecture Overview

The application follows a **3-tier client-server architecture**:

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT TIER (Frontend)                     │
│                          React 19.1.1                            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Manager    │  │   Employee   │  │    Auth      │          │
│  │  Dashboard   │  │  Dashboard   │  │  Pages       │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                   │
│         └──────────────────┴──────────────────┘                  │
│                            │                                      │
│                    REST API Calls (JSON)                         │
│                    HTTP/HTTPS Requests                           │
└────────────────────────────┼──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  APPLICATION TIER (Backend)                      │
│                  Node.js + Express 5.1.0                         │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                     API Routes                            │  │
│  │  /api/user  │  /api/project  │  /api/task  │  /api/emp   │  │
│  └──────────────────────┬─────────────────────────────────────┘  │
│                         │                                         │
│  ┌──────────────────────┴─────────────────────────────────────┐ │
│  │           Middleware Layer                                 │ │
│  │  • JWT Authentication & Authorization                      │ │
│  │  • Request Validation                                      │ │
│  │  • Error Handling                                          │ │
│  │  • CORS Configuration                                      │ │
│  │  • File Upload Processing                                  │ │
│  └──────────────────────┬─────────────────────────────────────┘ │
│                         │                                         │
└─────────────────────────┼─────────────────────────────────────────┘
                          │
                   Mongoose ODM
                          │
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DATA TIER (Database)                        │
│                        MongoDB 5.0+                              │
│                                                                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │    Users     │  │   Projects   │  │    Tasks     │          │
│  │  Collection  │  │  Collection  │  │  Collection  │          │
│  └──────────────┘  └──────────────┘  └──────────────┘          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

### Database Schema (ER Diagram)

```
┌─────────────────────────────────┐
│            User                 │
├─────────────────────────────────┤
│ _id: ObjectId (PK)              │
│ EmpId: String (Unique)          │
│ Name: String                    │
│ Email: String (Unique)          │
│ Password: String (Hashed)       │
│ isManager: Boolean              │
│ role: String                    │
│ department: String              │
│ joiningDate: Date               │
│ phone: String                   │
│ address: String                 │
│ project: [ObjectId] (FK)        │───────┐
│ tasks: [ObjectId] (FK)          │───┐   │
└─────────────────────────────────┘   │   │
                                       │   │
                                       │   │
         ┌─────────────────────────────┘   │
         │                                 │
         │                                 │
         ▼                                 ▼
┌─────────────────────────────────┐  ┌─────────────────────────────────┐
│            Task                 │  │          Project                │
├─────────────────────────────────┤  ├─────────────────────────────────┤
│ _id: ObjectId (PK)              │  │ _id: ObjectId (PK)              │
│ name: String                    │  │ managerId: ObjectId (FK)        │
│ assignedTo: ObjectId (FK) ──────┼──┤ Name: String                    │
│ status: String                  │  │ StartDate: Date                 │
│   ["To Do", "In Progress",      │  │ EndDate: Date                   │
│    "Completed"]                 │  │ Status: String                  │
│ priority: String                │  │   ["Active", "Completed",       │
│   ["Low", "Medium", "High"]     │  │    "Pending"]                   │
│ dueDate: Date                   │  │ client: String                  │
│ files: [{name, url}]            │  │ description: String             │
│ projectId: ObjectId (FK) ───────┼──┤ budget: Number                  │
└─────────────────────────────────┘  │ budgetUsed: Number              │
                                      │ team: [ObjectId] (FK)           │
                                      │ tasks: [ObjectId] (FK)          │
                                      └─────────────────────────────────┘

Relationships:
• User ↔ Project (Many-to-Many): Users can work on multiple projects
• User ↔ Task (One-to-Many): Users can have multiple tasks
• Project ↔ Task (One-to-Many): Projects contain multiple tasks
• Project → User (Many-to-One): Projects have one manager
• Task → User (Many-to-One): Tasks assigned to one user
• Task → Project (Many-to-One): Tasks belong to one project
```

### Component Architecture (Frontend)

```
App.js (Root Component)
│
├── UserProvider (Context)
│   └── Router
│       │
│       ├── Public Routes
│       │   ├── Login
│       │   └── Signup
│       │
│       ├── Manager Routes (Protected)
│       │   ├── Manager_Dashboard
│       │   │   ├── DashboardHeader
│       │   │   ├── DisplayProjectsStatus
│       │   │   ├── UpcomingDeadlinesList
│       │   │   ├── OverdueTasksCard
│       │   │   └── PerformanceMetrics
│       │   │
│       │   ├── Manager_Project
│       │   │   ├── AddNewProject
│       │   │   ├── ProjectsList
│       │   │   ├── ProjectCard
│       │   │   ├── Search_form
│       │   │   └── FilterButton
│       │   │
│       │   ├── ProjectTask
│       │   │   ├── DisplayProjectInformation
│       │   │   ├── AddNewTask
│       │   │   ├── EditTask
│       │   │   ├── TasksTable
│       │   │   └── TaskTableRow
│       │   │
│       │   └── Manager_Employees
│       │       ├── EmployeeList
│       │       └── EmployeeCard
│       │
│       └── Employee Routes (Protected)
│           ├── Employee_Dashboard
│           │   ├── EmployeeDashboardHeader
│           │   ├── EmployeeTaskSummaryCards
│           │   ├── EmployeeTaskPerformance
│           │   ├── UpcomingDeadlinesList
│           │   └── MissedDeadlineTasks
│           │
│           └── Employee_task
│               ├── EmployeeTaskHeader
│               ├── EmployeeTaskFilters
│               ├── EmployeeTasksTable
│               └── EmployeeTaskTableRow
```

---

## 🛠️ Technology Stack

### Frontend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.1 | UI library for building component-based interfaces |
| **React Router DOM** | 7.8.2 | Client-side routing and navigation |
| **React Bootstrap** | 2.10.10 | Pre-built Bootstrap components for React |
| **Bootstrap** | 5.3.7 | CSS framework for responsive design |
| **Tailwind CSS** | 4.1.11 | Utility-first CSS framework |
| **React Bootstrap Icons** | 1.11.6 | Icon library |
| **Web Vitals** | 2.1.4 | Performance metrics tracking |

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 14+ | JavaScript runtime environment |
| **Express.js** | 5.1.0 | Web application framework |
| **MongoDB** | 5.0+ | NoSQL database |
| **Mongoose** | 8.18.1 | MongoDB ODM (Object Data Modeling) |
| **JSON Web Token** | 9.0.2 | Secure authentication tokens |
| **bcryptjs** | 3.0.2 | Password hashing |
| **CORS** | 2.8.5 | Cross-Origin Resource Sharing |
| **dotenv** | 17.2.3 | Environment variable management |
| **express-fileupload** | latest | File upload handling |

### Development Tools

- **Visual Studio Code**: Primary code editor
- **Git & GitHub**: Version control and collaboration
- **Postman**: API testing and documentation
- **MongoDB Compass**: Database GUI
- **Chrome DevTools**: Frontend debugging
- **React Developer Tools**: React component inspection

---

## 📦 Installation & Setup

### Prerequisites

Before starting, ensure you have installed:
- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MongoDB** (v5.0+) - [Download](https://www.mongodb.com/try/download/community) OR [MongoDB Atlas Account](https://www.mongodb.com/cloud/atlas)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/PatelTaksh2006/project-management-tool.git
cd project-management-tool
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install
```

**Create Backend Environment File:**

Create a `.env` file in the `backend` directory:

```env
# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_min_32_characters
JWT_EXPIRES_IN=7d

# MongoDB Configuration
MONGODB_URI=mongodb://127.0.0.1:27017/ProDb
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ProDb?retryWrites=true&w=majority

# Server Configuration
PORT=3001
```

**Environment Variables Explained:**
- `JWT_SECRET`: Secret key for JWT token signing (use a strong, random string)
- `JWT_EXPIRES_IN`: Token expiration time (e.g., 7d = 7 days, 24h = 24 hours)
- `MONGODB_URI`: MongoDB connection string
- `PORT`: Backend server port (default: 3001)

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install
```

**Create Frontend Environment File:**

Create a `.env` file in the `frontend` directory:

```env
# Backend API Configuration
REACT_APP_API_URL=http://localhost:3001
```

### Step 4: Database Setup

#### Option 1: Local MongoDB

1. **Start MongoDB Service:**

```bash
# Windows
net start MongoDB

# macOS/Linux
sudo systemctl start mongod
# or
sudo service mongod start
```

2. The application will automatically create the database `ProDb` and required collections on first run.

#### Option 2: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Create a new cluster (Free Tier M0)
3. Create a database user with password
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs during development)
5. Get your connection string and update `MONGODB_URI` in backend `.env` file

#### Option 3: Restore from Database Dump

If you have a database dump:

```bash
# Restore to local MongoDB
mongorestore --db ProDb /path/to/dump/folder

# Restore to MongoDB Atlas
mongorestore --uri="mongodb+srv://username:password@cluster.mongodb.net/ProDb" /path/to/dump/folder
```

### Step 5: Verify Installation

Check that all dependencies are installed:

```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check MongoDB (if local)
mongod --version
```

---

## 🚀 Running the Project

### Development Mode

You need to run **both backend and frontend** servers simultaneously.

#### Terminal 1: Start Backend Server

```bash
cd backend
npm start
```

Output should show:
```
Server started at 3001
MongoDB connected successfully
```

Backend runs on: `http://localhost:3001`

#### Terminal 2: Start Frontend Server

```bash
cd frontend
npm start
```

Output should show:
```
Compiled successfully!
You can now view frontend in the browser.
Local: http://localhost:3000
```

Frontend runs on: `http://localhost:3000`

### Access the Application

1. Open your browser and navigate to `http://localhost:3000`
2. You'll see the login page
3. Create a new account via the signup page
4. Login with your credentials

### First Time Setup

**Create Manager Account:**
1. Go to signup page
2. Fill in details and select "Manager" role
3. Login as manager to access manager dashboard

**Create Employee Account:**
1. Go to signup page
2. Fill in details and select "Employee" role
3. Login as employee to access employee dashboard

---

## 📖 Usage Guide

### For Managers

#### Creating a Project
1. Navigate to **Projects** page from sidebar
2. Click **"Add New Project"** button
3. Fill in project details:
   - Project name
   - Client name
   - Start and end dates
   - Budget
   - Description
   - Status (Active/Pending/Completed)
4. Click **"Create Project"**

#### Adding Team Members to Project
1. Open project details
2. Click **"Add Team Member"**
3. Select employees from dropdown
4. Click **"Add"**

#### Creating Tasks
1. Open a project
2. Click **"Add New Task"**
3. Fill in task details:
   - Task name
   - Assign to employee (from project team)
   - Set priority (Low/Medium/High)
   - Set due date
   - Attach files (optional)
4. Click **"Create Task"**

#### Monitoring Performance
1. Go to **Dashboard**
2. View:
   - Project statistics
   - Task completion rates
   - Upcoming deadlines
   - Overdue tasks
3. Navigate to **Employees** to see individual performance

### For Employees

#### Viewing Tasks
1. Go to **Dashboard** or **Tasks** page
2. See all assigned tasks
3. Use filters to sort by:
   - Status
   - Priority
   - Project
   - Due date

#### Updating Task Status
1. Find your task in the table
2. Click on status dropdown
3. Select new status:
   - To Do
   - In Progress
   - Completed
4. Status updates automatically

#### Uploading Files
1. Open task details
2. Click **"Upload File"**
3. Select file from computer
4. File uploads and attaches to task

#### Tracking Performance
1. Go to **Dashboard**
2. View personal metrics:
   - Total tasks
   - Completion rate
   - On-time delivery
   - Tasks by status

---

## 🔌 API Documentation

### Base URL
```
http://localhost:3001/api
```

### Authentication

All protected endpoints require JWT token in header:
```
Authorization: Bearer <token>
```

### User Endpoints

#### Register User
```http
POST /api/user/register
Content-Type: application/json

{
  "Name": "John Doe",
  "Email": "john@example.com",
  "Password": "password123",
  "EmpId": "EMP001",
  "role": "Manager",
  "department": "IT",
  "joiningDate": "2024-01-01",
  "phone": "1234567890",
  "address": "123 Main St",
  "isManager": true
}

Response: 201 Created
{
  "message": "User registered successfully"
}
```

#### Login
```http
POST /api/user/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "507f1f77bcf86cd799439011",
    "Name": "John Doe",
    "Email": "john@example.com",
    "isManager": true,
    "role": "Manager",
    "department": "IT"
  }
}
```

#### Get All Users
```http
GET /api/user
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "Name": "John Doe",
    "Email": "john@example.com",
    "role": "Manager",
    "department": "IT"
  }
]
```

### Project Endpoints

#### Create Project
```http
POST /api/project/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "Name": "Website Redesign",
  "client": "ABC Corp",
  "StartDate": "2024-01-01",
  "EndDate": "2024-06-30",
  "budget": 50000,
  "description": "Complete website redesign project",
  "Status": "Active",
  "managerId": "507f1f77bcf86cd799439011"
}

Response: 201 Created
{
  "_id": "507f191e810c19729de860ea",
  "Name": "Website Redesign",
  "Status": "Active",
  ...
}
```

#### Get All Projects
```http
GET /api/project
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "_id": "507f191e810c19729de860ea",
    "Name": "Website Redesign",
    "Status": "Active",
    "budget": 50000,
    "team": [...],
    "tasks": [...]
  }
]
```

#### Update Project
```http
PUT /api/project/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "Status": "Completed",
  "budgetUsed": 45000
}

Response: 200 OK
{
  "_id": "507f191e810c19729de860ea",
  "Status": "Completed",
  ...
}
```

#### Delete Project
```http
DELETE /api/project/:id
Authorization: Bearer <token>

Response: 200 OK
{
  "message": "Project deleted successfully"
}
```

### Task Endpoints

#### Create Task
```http
POST /api/task/create
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Design homepage mockup",
  "projectId": "507f191e810c19729de860ea",
  "assignedTo": "507f1f77bcf86cd799439011",
  "status": "To Do",
  "priority": "High",
  "dueDate": "2024-02-15"
}

Response: 201 Created
{
  "_id": "507f1f77bcf86cd799439099",
  "name": "Design homepage mockup",
  "status": "To Do",
  ...
}
```

#### Get Tasks by Project
```http
GET /api/task/project/:projectId
Authorization: Bearer <token>

Response: 200 OK
[
  {
    "_id": "507f1f77bcf86cd799439099",
    "name": "Design homepage mockup",
    "status": "To Do",
    "priority": "High",
    "assignedTo": {...}
  }
]
```

#### Get Tasks by Employee
```http
GET /api/task/getByEmployee/:employeeId
Authorization: Bearer <token>

Response: 200 OK
{
  "tasks": [
    {
      "_id": "507f1f77bcf86cd799439099",
      "name": "Design homepage mockup",
      "status": "In Progress",
      "projectId": {...}
    }
  ]
}
```

#### Update Task Status
```http
PUT /api/task/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "Completed"
}

Response: 200 OK
{
  "_id": "507f1f77bcf86cd799439099",
  "status": "Completed",
  ...
}
```

### File Upload Endpoint

#### Upload File
```http
POST /api/upload
Content-Type: multipart/form-data

Form Data:
- file: <file>

Response: 200 OK
{
  "url": "/api/upload/filename.pdf"
}
```

---

## 🧪 Testing

### Manual Testing Performed

#### Authentication Testing
- ✅ User registration with valid data
- ✅ Login with correct credentials
- ✅ Login failure with wrong credentials
- ✅ Token expiration handling
- ✅ Protected route access without token
- ✅ Role-based route protection

#### Manager Module Testing
- ✅ Create, read, update, delete projects
- ✅ Add/remove team members from projects
- ✅ Create tasks and assign to employees
- ✅ View all employees
- ✅ Filter and search projects
- ✅ Dashboard metrics display

#### Employee Module Testing
- ✅ View assigned tasks
- ✅ Update task status
- ✅ Filter tasks by status, priority, project
- ✅ Upload files to tasks
- ✅ View performance metrics
- ✅ Dashboard statistics

### API Testing with Postman

All API endpoints tested for:
- Correct response codes (200, 201, 400, 401, 404, 500)
- Response data structure
- Error handling
- Token validation
- CORS headers

### Browser Compatibility Testing

Tested on:
- ✅ Chrome 120+
- ✅ Firefox 120+
- ✅ Microsoft Edge 120+
- ⚠️ Safari (limited testing)

### Responsive Design Testing

Tested on:
- ✅ Desktop (1920x1080, 1366x768)
- ✅ Tablet (iPad, 768x1024)
- ⚠️ Mobile (375x667, needs improvement)

### Known Issues

1. File upload size limit not enforced consistently
2. Mobile UI needs refinement on screens below 375px
3. No automated test suite implemented
4. Performance not tested under load

---

## ⚠️ Limitations

### Current Shortcomings

#### Functional Limitations:
- ❌ No real-time notifications or push alerts
- ❌ No in-app messaging between users
- ❌ Limited data visualization (no charts/graphs)
- ❌ No report export (PDF, Excel)
- ❌ No password reset functionality
- ❌ No email verification
- ❌ Cannot archive projects (only delete)
- ❌ No task dependencies or subtasks
- ❌ No recurring tasks
- ❌ No time tracking
- ❌ Single user per task assignment
- ❌ No project templates
- ❌ No Gantt chart view

#### Technical Limitations:
- ❌ Not tested for 100+ concurrent users
- ❌ No database indexing optimization
- ❌ No caching (Redis)
- ❌ No load balancing
- ❌ Tokens in localStorage (XSS vulnerability)
- ❌ No rate limiting on API endpoints
- ❌ No HTTPS in development
- ❌ No two-factor authentication
- ❌ No automated backups
- ❌ No pagination for large datasets
- ❌ Files stored locally (not cloud storage)
- ❌ No CI/CD pipeline
- ❌ No automated tests

#### Performance Limitations:
- ⚠️ All data loaded at once (no lazy loading)
- ⚠️ No image optimization
- ⚠️ No CDN for static assets
- ⚠️ Basic error logging only

### Resource Constraints

- Built as academic semester project
- Limited development time
- Solo/small team development
- Free-tier MongoDB Atlas
- Local development environment only
- No production deployment

---

## 🚀 Future Enhancements

### Planned Features

#### Phase 1: Core Improvements
1. **Real-time Notifications**
   - WebSocket implementation
   - Push notifications for task updates
   - Email notifications
   - Deadline reminders

2. **Enhanced Communication**
   - In-app messaging
   - Task comments and discussions
   - @mentions and notifications
   - Activity feed

3. **Advanced Analytics**
   - Charts and graphs (Chart.js/D3.js)
   - Project timeline visualization
   - Gantt charts
   - Burndown charts
   - Custom reports

4. **Security Enhancements**
   - Two-factor authentication
   - Password reset via email
   - Rate limiting
   - HTTPS enforcement
   - Session management improvements

#### Phase 2: Feature Expansion
1. **Task Management**
   - Task dependencies
   - Subtasks and checklists
   - Recurring tasks
   - Task templates
   - Time tracking
   - Multiple assignees

2. **Project Management**
   - Project templates
   - Project archiving
   - Budget alerts
   - Resource allocation
   - Milestone tracking

3. **Collaboration**
   - File versioning
   - Document preview
   - Shared calendars
   - Team chat rooms

4. **User Experience**
   - Dark mode
   - Customizable dashboards
   - Drag-and-drop task boards
   - Keyboard shortcuts
   - Advanced search

#### Phase 3: Scalability & Integration
1. **Performance Optimization**
   - Database indexing
   - Query optimization
   - Lazy loading and pagination
   - Image compression
   - CDN integration
   - Caching (Redis)

2. **Cloud Deployment**
   - AWS/Azure/Heroku deployment
   - Load balancing
   - Auto-scaling
   - Database clustering

3. **Third-party Integrations**
   - Slack integration
   - Google Calendar sync
   - JIRA import/export
   - GitHub integration
   - Email services (SendGrid)

4. **API & Extensions**
   - Public API with documentation
   - Webhooks
   - API versioning
   - SDK for developers

#### Phase 4: Advanced Features
1. **AI & Automation**
   - Task priority prediction
   - Workload optimization
   - Automated task assignment
   - Smart deadline suggestions

2. **Mobile Applications**
   - React Native mobile app
   - iOS and Android native apps
   - Offline mode support

3. **Enterprise Features**
   - SSO (Single Sign-On)
   - LDAP/Active Directory integration
   - Custom roles and permissions
   - Audit logs
   - Compliance features

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### How to Contribute

1. **Fork the Repository**
   ```bash
   # Click the Fork button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/your-username/project-management-tool.git
   cd project-management-tool
   ```

3. **Create a Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```

4. **Make Your Changes**
   - Write clean, documented code
   - Follow existing code style
   - Test your changes thoroughly

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "Add: Amazing new feature"
   ```

6. **Push to Your Fork**
   ```bash
   git push origin feature/AmazingFeature
   ```

7. **Open a Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Describe your changes

### Contribution Guidelines

- Follow existing code structure and naming conventions
- Write clear commit messages
- Update documentation for new features
- Test your code before submitting
- One feature per pull request

### Areas Needing Help

- 🐛 Bug fixes
- 📝 Documentation improvements
- ✨ New feature implementations
- 🎨 UI/UX enhancements
- 🧪 Writing tests
- 🌐 Translations/i18n

---

## 📄 License

This project is licensed under the **ISC License**.

```
ISC License

Copyright (c) 2024 Taksh Patel

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
```

---

## 👥 Authors & Acknowledgments

### Project Team

**Taksh Patel**
- GitHub: [@PatelTaksh2006](https://github.com/PatelTaksh2006)
- Role: Full Stack Developer
- Email: [Contact via GitHub]

### Acknowledgments

- **MongoDB** for excellent database documentation
- **React** team for comprehensive React docs
- **Express.js** community for middleware examples
- **Stack Overflow** community for troubleshooting help
- Academic advisors and peers for feedback

---

## 📞 Support & Contact

### Getting Help

- 📖 Check the [Documentation](#-table-of-contents) above
- 🐛 Report bugs via [GitHub Issues](https://github.com/PatelTaksh2006/project-management-tool/issues)
- 💬 Ask questions in [Discussions](https://github.com/PatelTaksh2006/project-management-tool/discussions)

### Project Links

- **Repository**: [https://github.com/PatelTaksh2006/project-management-tool](https://github.com/PatelTaksh2006/project-management-tool)
- **Issues**: [https://github.com/PatelTaksh2006/project-management-tool/issues](https://github.com/PatelTaksh2006/project-management-tool/issues)

---

## 📚 References & Resources

### Documentation

- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Documentation](https://mongoosejs.com/docs/)
- [JWT Introduction](https://jwt.io/introduction)
- [Bootstrap Documentation](https://getbootstrap.com/docs/)
- [React Router Documentation](https://reactrouter.com/)

### Tutorials & Learning Resources

- [The MERN Stack Tutorial](https://www.mongodb.com/languages/mern-stack-tutorial)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [React Patterns](https://reactpatterns.com/)
- [RESTful API Design](https://restfulapi.net/)

### Tools & Libraries

- [Visual Studio Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/)
- [MongoDB Compass](https://www.mongodb.com/products/compass)
- [Git Documentation](https://git-scm.com/doc)

### Inspiration

- [Trello](https://trello.com/)
- [Asana](https://asana.com/)
- [JIRA](https://www.atlassian.com/software/jira)
- [Monday.com](https://monday.com/)

---

## 📊 Project Statistics

- **Lines of Code**: ~15,000+
- **Components**: 40+ React components
- **API Endpoints**: 20+ REST endpoints
- **Database Collections**: 3 main collections
- **Development Time**: 1 semester (4 months)
- **Technologies Used**: 15+ libraries and frameworks

---

## 🎓 Academic Information

**Course**: Advanced Topics in Software Engineering  
**Semester**: 5  
**Institution**: [Your Institution Name]  
**Year**: 2024-2025  

---

<div align="center">

### ⭐ If you found this project helpful, please consider giving it a star!

**Built with ❤️ using MERN Stack**

[Report Bug](https://github.com/PatelTaksh2006/project-management-tool/issues) · [Request Feature](https://github.com/PatelTaksh2006/project-management-tool/issues) · [View Demo](#)

</div>

---

**Last Updated**: November 2025  
**Version**: 1.0.0
