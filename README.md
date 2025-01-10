# 🚀 Online Judge System

Welcome to **Online Judge**, a fully-featured platform that enables users to practice coding problems, submit solutions, and receive instant feedback based on predefined test cases. Built with a robust architecture, this platform is designed to ensure security, scalability, and optimal performance.

---

## 🌐 Live Demo

Explore the live application:

🔗 [https://codebash.online/](https://codebash.online/)

---

---

### 🎥 Application Demo

![Application Demo](media/online_judge_demo.gif)

---

## 🌟 Features

- **User Authentication**: Secure login and registration using JWT for session management.
- **Problem Management**: Admins can add, update, and delete problems with detailed descriptions, input/output formats, constraints, and example cases.
- **Real-Time Code Evaluation**: Compile and execute code in a sandboxed environment using Docker.
- **Language Support**: Users can choose their preferred programming language.
- **Verdict System**: Instant feedback on submissions (e.g., Accepted, Wrong Answer).
---

## 🖥️ Technologies Used

### Backend
- **Node.js** and **Express.js** for server-side logic and APIs.
- **MongoDB (Atlas)** for database management.
- **Docker** for creating isolated sandbox environments for code execution.

### Frontend
- **React.js** for a dynamic and responsive user interface.

### Deployment
- **AWS EC2** for hosting the backend and compiler services.
- **Vercel** or other cloud services for frontend deployment.

---

## 🚀 API Endpoints

### **Authentication**
- **POST** `/api/auth/register`  
  Register a new user.

- **POST** `/api/auth/login`  
  Authenticate and log in an existing user.

---

### **Problem Management**
- **GET** `/api/problems`  
  Fetch a list of all coding problems.

- **GET** `/api/problems/:id`  
  Fetch details of a specific problem.

---

### **Code Submission**
- **POST** `/api/submissions`  
  Submit code for evaluation. The payload includes the problem ID, code, and programming language.

---

## 🔧 How to Run the Project Locally

Follow these steps to set up the project on your local machine.

### Prerequisites
- **Node.js** (v14 or above) and npm installed. [Download Node.js](https://nodejs.org/)
- **MongoDB** database instance (local or Atlas).
- **Docker** installed for sandboxed code execution. [Download Docker](https://www.docker.com/)

---

### 1. Clone the Repository
```bash
git clone https://github.com/vivagarwal/Online-Judge.git
cd Online-Judge
```

---

### 2. Setting Up the Backend Server

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory:
   ```plaintext
   MONGO_URI=<Your MongoDB Connection String>
   SECRET_KEY=<Your JWT Secret Key>
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

   The backend server will run at `http://localhost:8080` by default.

---

### 3. Setting Up the Compiler Service

1. Navigate to the compiler service directory:
   ```bash
   cd compiler
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start Docker and build the sandbox environment:
   ```bash
   docker build -t online-judge-compiler .
   docker run -d --name compiler -p 5001:5001 online-judge-compiler
   ```

4. The compiler service will run at `http://localhost:5001`.

---

### 4. Setting Up the Frontend

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory:
   ```plaintext
   VITE_BASE_URL=http://localhost:8080
   VITE_BASE_URL1=http://localhost:5001
   ```

4. Start the frontend development server:
   ```bash
   npm run dev
   ```

   The frontend application will run at `http://localhost:5173`.

---

## 📝 Example Code Execution Flow

1. **Frontend**: The user selects a problem, writes their code in the preferred language, and submits it.
2. **Backend API**: Receives the code and problem ID. Saves the code as a file and sends it to the compiler service.
3. **Compiler Service**: 
   - Creates a Docker container for the code execution.
   - Compiles and runs the code against predefined test cases.
   - Compares the output with the expected results and generates a verdict.
4. **Backend API**: Saves the submission and verdict in the database.
5. **Frontend**: Displays the verdict to the user (e.g., Accepted, Wrong Answer).

---

## 📦 Deployment

### Backend and Compiler Deployment on AWS EC2
1. Set up an EC2 instance with Docker and Node.js installed.
2. Clone the repository and set up the backend and compiler services as described above.
3. Ensure the services are accessible via public IP.

### Frontend Deployment
1. Deploy the frontend on Render, Vercel, or any other hosting service.
2. Set the `VITE_BASE_URL` environment variable to point to the live backend URL.
3. Set the `VITE_BASE_URL1` environment variable to point to the live compiler URL.


---

## 📬 Contact

For questions or feedback, feel free to reach out:

---

## 🔒 License

This project is licensed under the MIT License.

---

🎉 **Thank you for checking out Online Judge! Happy Coding!**
```