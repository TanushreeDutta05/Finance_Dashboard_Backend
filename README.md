# Finance Dashboard Backend API

A comprehensive finance dashboard backend system with role-based access control (RBAC) built using Node.js, Express, and MongoDB. This API enables secure financial record management, analytics, and dashboard insights.


## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit
- **Logging**: morgan
- **API Docs**: Swagger (swagger-jsdoc + swagger-ui-express)


## Roles
- Viewer: Read-only dashboard access
- Analyst: Read-only financial records + dashboard access
- Admin: Full system access (CRUD + user management)


## Features
- User and Role Management (Viewer, Analyst, Admin)
- Financial Records Management (CRUD operations)
- Dashboard Summary APIs with analytics
- Role-based Access Control(RBAC)
- Input Validation and Error Handling
- MongoDB Data Persistence
- JWT Authentication
- Pagination for record listing
- Search and filtering functionality
- Soft delete support
- Rate limiting for API protection
- API documentation (this README + Swagger)
- Category-based financial insights
- Monthly trends analysis
- Recent activity tracking


## Project Structure
src/

│── config/        
│── controllers/   
│── middlewares/   
│── models/        
│── routes/        
│── swagger/       
│── server.js      


## Authentication Flow
- Users authenticate using JWT
- Token is sent via Authorization: Bearer <token>
- Role-based middleware validates permissions per route


## API Overview

### 1. Authentication
- **POST** `/api/auth/register` → Register new user
- **POST** `/api/auth/login` → Login user
- **GET** `/api/auth/me` → Get current authenticated user

### 2. User Management *(Admin only)*
- **GET** `/api/users` → Get all users (filters & pagination)
- **GET** `/api/users/:id` → Get single user
- **POST** `/api/users` → Create new user
- **PUT** `/api/users/:id` → Update user details
- **DELETE** `/api/users/:id` → Soft delete user

### 3. Financial Records
- **POST** `/api/records` → Create a new record *(Admin only)*
- **GET** `/api/records` → List records (filters & pagination) *(Analyst + Admin)*
- **GET** `/api/records/:id` → Get single record *(Analyst + Admin)*
- **PUT** `/api/records/:id` → Update record *(Admin only)*
- **DELETE** `/api/records/:id` → Soft delete record *(Admin only)*

### 4. Dashboard Analytics
- **GET** `/api/dashboard/summary`  
  → Financial summary (totals, categories, recent activity) *(Viewer + Analyst + Admin)*

- **GET** `/api/dashboard/trends`  
  → Income & expense trends (default: last 6 months) *(Viewer + Analyst + Admin)*

- **GET** `/api/dashboard/insights`  
  → Top spending categories & income sources *(Viewer + Analyst + Admin)*


## API Documentation
- APIs are fully documented in this README
- After starting the server, access the Swagger API docs at: http://localhost:5000/api/docs


## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (Local instance or MongoDB Atlas)
- npm or yarn

### Step 1: Clone the Repository
- git clone <https://github.com/TanushreeDutta05/Finance_Dashboard_Backend.git>
- cd finance-dashboard-backend

### Step 2: Install Dependencies
- npm install

### Step 3: Environment Configuration
Create a .env file in the project root and add the following variables:
- PORT=5000
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret_key
- JWT_EXPIRE=7d
- NODE_ENV=development

### Step 4: Run the Application
- npm run dev

### Base URL
- The server will start on: http://localhost:5000


## Testing
- Tested using Postman and Swagger
- All endpoints verified with sample data
- Role-based access tested for different users


## Error Handling
- Proper HTTP status codes used (400, 401, 403, 404, 500)
- Input validation using express-validator
- Structured error responses


## Security Features
- JWT-based authentication
- Password hashing (bcrypt)
- Rate limiting to prevent abuse
- Helmet for secure HTTP headers
- CORS configuration


## Engineering Decisions
- MVC architecture for clean separation of concerns
- Middleware-based Authentication and RBAC
- MongoDB Aggregation Pipelines for analytics and performance
- Soft deletes to preserve historical financial data
- Scalable and modular folder structure suitable for production growth


## Assumptions
1. The application is designed for small to medium-scale usage, suitable for internal dashboards or early-stage products.
2. Each user is assigned one role at a time (Viewer, Analyst, or Admin) to keep authorization simple and maintainable.
3. Financial records represent business-level financial data, not real-time banking or transactional systems.
4. Dashboard analytics are intended for insight and reporting, not high-frequency real-time computation.
5. MongoDB is considered an appropriate choice due to its flexible schema and powerful aggregation support.


## Trade-offs
1. The API is not deployed to a live server to save time and complexity. Instead, Swagger UI is provided for easy testing.
2. MongoDB over SQL for faster iteration and flexible schema.
3. JWT authentication for scalability and statelessness, with careful handling of token expiration and security.
4. RBAC chosen for simplicity over permission-based access control (PBAC).
5. Soft deletes preserve historical data at the cost of extra filtering.
6. On-demand aggregation ensures accurate analytics with moderate compute overhead.


## Notes
- .env file is excluded for security reasons
- Create a .env file using the above format
- Use MongoDB Atlas for cloud database (recommended)


## Author
**Tanushree Dutta**


