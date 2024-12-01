# Node.js Project Setup and Instructions

This README provides the steps to set up and run the Node.js project locally.

## Prerequisites

Before you begin, ensure that you have the following installed:

- **Node.js** (v14 or higher) - [Download Node.js](https://nodejs.org/)
- **npm** (comes with Node.js, but you can update it using `npm install -g npm`)
- **MongoDB** (for database use) - [MongoDB installation](https://www.mongodb.com/try/download/community) (if you're using MongoDB locally)

## Project Setup

### 1. Clone the Repository

Clone the repository to your local machine using Git:

```bash
git clone https://github.com/adityadixit07/Assignment_Submission_Portal_Node.js.git
cd Assignment_Submission_Portal_Node.js
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a .env file in the root directory of the project to store environment variables. Here’s an example of the .env file configuration:

```bash
PORT=5000                    # Port to run the server
MONGO_URI=mongodb://localhost:27017/your-database-name  # MongoDB connection URI
JWT_SECRET_KEY=your_jwt_secret_key  # JWT Secret key for token signing
NODE_ENV=development  # Set to 'production' for production environment
```

### 4. Start Project

```bash
npm run dev
```
