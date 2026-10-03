# Campus Complaint Tracker API

A production-grade, RESTful backend API built with **Node.js**, **Express.js**, and **MongoDB / Mongoose** following the **MVC (Model-View-Controller)** architectural pattern.

Designed specifically for registering and managing campus complaints with strict validation, status progression workflows, multi-field filtering, and regex-powered searching.

---

## 📁 Project Structure

```text
campus-complaint-tracker/
├── config/
│   └── db.js                              # MongoDB connection logic
├── controllers/
│   └── complaintController.js             # Business logic & error handling
├── models/
│   └── Complaint.js                       # Mongoose Schema & Validations
├── routes/
│   └── complaintRoutes.js                 # Express route mappings
├── seeds/
│   └── seed.js                            # Sample database seed script
├── .env                                   # Environment variables
├── .env.example                           # Sample environment configuration
├── .gitignore                             # Git ignore rules
├── package.json                           # Dependencies & scripts
├── README.md                              # Complete API & Testing Documentation
└── campus-complaint-tracker.postman_collection.json # Ready-to-import Postman Collection
```

---

## ⚙️ Tech Stack & Prerequisites

- **Node.js**: v18.x or later
- **npm**: v9.x or later
- **MongoDB**: Local MongoDB instance (`mongodb://127.0.0.1:27017`) or MongoDB Atlas URI
- **Express.js**: v4.21.2
- **Mongoose**: v8.9.5

---

## 🚀 Quick Setup & Installation

### 1. Install Dependencies
Open your terminal in the `campus-complaint-tracker` directory and run:
```bash
npm install
```

### 2. Configure Environment Variables
Verify or edit `.env` in the root folder:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/campus_complaint_tracker
NODE_ENV=development
```
*(If using MongoDB Atlas, replace `MONGO_URI` with your connection string).*

### 3. (Optional) Seed Sample Data
Populate MongoDB with 4 varied complaints (different categories, priorities, and statuses):
```bash
npm run seed
```

### 4. Start the Server
- **Development Mode** (with Nodemon hot-reload):
  ```bash
  npm run dev
  ```
- **Production Mode**:
  ```bash
  npm start
  ```

Server will start on: **`http://localhost:5000`**

---

## 📋 Data Model Specification

### Complaint Schema (`models/Complaint.js`)

| Field | Type | Validation / Rules | Default |
| :--- | :--- | :--- | :--- |
| `studentName` | String | **Required**, Min 2 chars, Max 60 chars, trimmed | — |
| `email` | String | **Required**, Valid email regex, lowercase, trimmed | — |
| `title` | String | **Required**, Min 5 chars, Max 120 chars, trimmed | — |
| `description` | String | **Required**, Min 10 chars, trimmed | — |
| `category` | String | **Required**, Enum: `['Infrastructure', 'IT', 'Cleanliness', 'Security', 'Other']` | `'Other'` |
| `priority` | String | **Required**, Enum: `['Low', 'Medium', 'High']` | `'Medium'` |
| `location` | String | Optional, trimmed | `'Campus Premises'` |
| `status` | String | **Required**, Enum: `['Open', 'In Progress', 'Resolved', 'Rejected']` | `'Open'` |
| `createdAt` | Date | Automatically generated timestamp | System Date |
| `updatedAt` | Date | Automatically updated timestamp | System Date |

---

## 🌐 API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint | Description | Status Code |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | API Information & Endpoint Directory | `200 OK` |
| `GET` | `/api/health` | Health check & uptime status | `200 OK` |
| `POST` | `/api/complaints` | Create a new complaint | `201 Created` |
| `GET` | `/api/complaints` | Get all complaints (with filters & search) | `200 OK` |
| `GET` | `/api/complaints/:id` | Get single complaint by ID | `200 OK` / `404 Not Found` |
| `PUT` | `/api/complaints/:id` | Update complaint details | `200 OK` / `404 Not Found` |
| `PATCH`| `/api/complaints/:id/status` | Update only complaint status | `200 OK` / `400 Bad Request` |
| `DELETE`| `/api/complaints/:id` | Delete complaint | `200 OK` / `404 Not Found` |

---

## 🔍 Query Parameters & Filtering

### 1. Filter by Status
```http
GET /api/complaints?status=Open
GET /api/complaints?status=In Progress
GET /api/complaints?status=Resolved
GET /api/complaints?status=Rejected
```

### 2. Filter by Category
```http
GET /api/complaints?category=Infrastructure
GET /api/complaints?category=IT
GET /api/complaints?category=Cleanliness
GET /api/complaints?category=Security
GET /api/complaints?category=Other
```

### 3. Filter by Priority
```http
GET /api/complaints?priority=High
GET /api/complaints?priority=Medium
GET /api/complaints?priority=Low
```

### 4. Search by Title or Student Name (Case-Insensitive Regex)
```http
GET /api/complaints?search=Projector
GET /api/complaints?search=Aarav
GET /api/complaints?search=wifi
```

### 5. Multi-Filter Combination
```http
GET /api/complaints?category=Infrastructure&priority=High&status=Open
```

---

## 🧪 Request & Response Payloads

### 1. Create Complaint
- **`POST /api/complaints`**
- **Headers:** `Content-Type: application/json`
- **Request Body:**
```json
{
  "studentName": "Aarav Sharma",
  "email": "aarav.sharma@campus.edu",
  "title": "Broken Projector in Lecture Hall 3B",
  "description": "The ceiling projector flickers constantly and shuts down every 10 minutes during classes.",
  "category": "Infrastructure",
  "priority": "High",
  "location": "Science Block, Room 3B"
}
```
- **Response (`201 Created`):**
```json
{
  "success": true,
  "message": "Complaint registered successfully",
  "data": {
    "_id": "6700abcd1234567890ef1111",
    "studentName": "Aarav Sharma",
    "email": "aarav.sharma@campus.edu",
    "title": "Broken Projector in Lecture Hall 3B",
    "description": "The ceiling projector flickers constantly and shuts down every 10 minutes during classes.",
    "category": "Infrastructure",
    "priority": "High",
    "location": "Science Block, Room 3B",
    "status": "Open",
    "createdAt": "2026-10-03T05:30:00.000Z",
    "updatedAt": "2026-10-03T05:30:00.000Z"
  }
}
```

---

### 2. Get All Complaints
- **`GET /api/complaints`**
- **Response (`200 OK`):**
```json
{
  "success": true,
  "count": 1,
  "data": [
    {
      "_id": "6700abcd1234567890ef1111",
      "studentName": "Aarav Sharma",
      "email": "aarav.sharma@campus.edu",
      "title": "Broken Projector in Lecture Hall 3B",
      "description": "The ceiling projector flickers constantly and shuts down every 10 minutes during classes.",
      "category": "Infrastructure",
      "priority": "High",
      "location": "Science Block, Room 3B",
      "status": "Open",
      "createdAt": "2026-10-03T05:30:00.000Z",
      "updatedAt": "2026-10-03T05:30:00.000Z"
    }
  ]
}
```

---

### 3. Update Complaint Details
- **`PUT /api/complaints/:id`**
- **Request Body:**
```json
{
  "title": "Broken Projector in Lecture Hall 3B (Urgent Repair)",
  "description": "Technician confirmed lamp replacement is needed.",
  "priority": "High",
  "location": "Science Block, Room 3B"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Complaint updated successfully",
  "data": {
    "_id": "6700abcd1234567890ef1111",
    "studentName": "Aarav Sharma",
    "email": "aarav.sharma@campus.edu",
    "title": "Broken Projector in Lecture Hall 3B (Urgent Repair)",
    "description": "Technician confirmed lamp replacement is needed.",
    "category": "Infrastructure",
    "priority": "High",
    "location": "Science Block, Room 3B",
    "status": "Open",
    "createdAt": "2026-10-03T05:30:00.000Z",
    "updatedAt": "2026-10-03T05:35:00.000Z"
  }
}
```

---

### 4. Update Complaint Status Only
- **`PATCH /api/complaints/:id/status`**
- **Request Body:**
```json
{
  "status": "In Progress"
}
```
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Complaint status updated to 'In Progress' successfully",
  "data": {
    "_id": "6700abcd1234567890ef1111",
    "status": "In Progress",
    "updatedAt": "2026-10-03T05:40:00.000Z"
  }
}
```

---

### 5. Delete Complaint
- **`DELETE /api/complaints/:id`**
- **Response (`200 OK`):**
```json
{
  "success": true,
  "message": "Complaint deleted successfully",
  "data": {
    "id": "6700abcd1234567890ef1111",
    "title": "Broken Projector in Lecture Hall 3B (Urgent Repair)"
  }
}
```

---

## ⚠️ Error Handling & Edge Cases

| Scenario | HTTP Status | Response Payload |
| :--- | :--- | :--- |
| Missing required fields | `400 Bad Request` | `{"success": false, "message": "Missing required field(s): studentName, email"}` |
| Invalid Email format | `400 Bad Request` | `{"success": false, "message": "Validation Error", "errors": ["Please provide a valid email address..."]}` |
| Invalid Status in PATCH | `400 Bad Request` | `{"success": false, "message": "Invalid status value 'Pending'. Allowed values are: 'Open', 'In Progress', 'Resolved', 'Rejected'"}` |
| Invalid MongoDB ID format | `400 Bad Request` | `{"success": false, "message": "Invalid complaint ID format: 'abc-123'"}` |
| Complaint ID not found | `404 Not Found` | `{"success": false, "message": "Complaint not found with ID: 65c8f8b80000000000000000"}` |

---

## 📮 Postman Testing Instructions

1. Open **Postman**.
2. Click **Import** (top left).
3. Select the file:
   `campus-complaint-tracker/campus-complaint-tracker.postman_collection.json`
4. The collection will import with 5 organized folders:
   - `01 - Health & Overview`
   - `02 - Create Complaints (POST /api/complaints)` *(Contains 4 diverse samples with auto-capture of `complaint_id`)*
   - `03 - Read Complaints (GET /api/complaints)` *(Filters, search, regex)*
   - `04 - Single Complaint Operations` *(GET by ID, PUT details, PATCH status, DELETE)*
   - `05 - Validation & Error Testing` *(Missing fields, invalid email, invalid status, invalid ID)*
5. Ensure your Node server is running on `http://localhost:5000` and start testing!
