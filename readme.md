# 🏦 Bank of Oredata - Mini Banking Application

This is a full-stack **Mini Banking Application** consisting of a **Spring Boot** backend and a **React + TypeScript** frontend. It allows users to create accounts, search for accounts, manage their profiles, transfer money, and view transaction history securely.

## 🚀 Features

*   **User Management:** Secure Registration & Login with **JWT Authentication**.
*   **Account Operations:**
    *   Create new accounts.
    *   **Deposit & Withdraw:** Easily manage your balance with deposit and withdrawal options.
    *   Search for accounts.
    *   Edit account details.
    *   Delete accounts.
*   **Money Transfer:**
    *   **Self-Transfer:** Move money between your own accounts.
    *   **P2P Transfer:** Send money to other users using their unique **10-digit Account Number**.
*   **Account Numbers:** System automatically generates realistic, 10-digit unique account numbers (e.g., `1234567890`) for every new account.
*   **Transaction History:**
    *   View transactions per account.
    *   Consolidated Global History page for all transactions.
*   **Robust Concurrency Handling:**
    *   **Simultaneous Transactions:** Uses **Optimistic Locking** (`@Version`) to safely handle simultaneous deposit, withdrawal, and transfer requests without race conditions.
    *   **Atomic Operations:** Ensures data integrity even under high load.
*   **Security:**
    *   BCrypt password hashing.
    *   Stateless JWT authentication.
    *   IDOR Protection (Users can only access their own data).
*   **Modern UI:**
    *   Built with **Shadcn UI** & **Tailwind CSS**.
    *   React Hook Form & Zod validation.
    *   TanStack Query for efficient server state management.

## 🛠️ Tech Stack

### Backend
*   **Language:** Java 17+
*   **Framework:** Spring Boot 3.x
*   **Security:** Spring Security, JWT
*   **Database:** PostgreSQL (Dockerized)
*   **ORM:** Hibernate / JPA
*   **Build Tool:** Maven

### Frontend
*   **Library:** React
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS, Shadcn UI
*   **State Management:** Zustand, TanStack Query
*   **Form Handling:** React Hook Form, Zod
*   **Routing:** React Router DOM
*   **Icons:** Lucide React

## ⚙️ Setup & Installation

### 1. Prerequisites
*   **Docker Desktop** (for PostgreSQL).
*   **Java JDK 17** or higher.
*   **Node.js 18+** and **npm**.

### 2. Start Database (Backend)
Navigate to the project root directory (where `docker-compose.yml` is located) and run:

```bash
docker-compose up -d
```
This will start a PostgreSQL container on port **5433**.

### 3. Run Backend API
Open a terminal, navigate to the `banking-backend` directory, and run:

```bash
cd banking-backend

# MacOS / Linux
./mvnw spring-boot:run

# Windows
mvnw spring-boot:run
```
The Backend API will be available at: `http://localhost:8080`.
*   **Swagger UI:** `http://localhost:8080/swagger-ui.html`

### 4. Run Frontend Application
Open a new terminal and navigate to the `banking-frontend` directory:

```bash
cd banking-frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```

The Frontend Application will be available at: `http://localhost:5173` (or the port shown in your terminal).

## 📖 Usage Guide

1.  **Register:** Create a new user account on the Register page.
2.  **Login:** Log in with your new credentials.
3.  **Create Account:** Go to "My Accounts" and click "Create Account" to open a bank account.
4.  **Transfer:** Use the "Money Transfer" page to send money.
    *   Select **"My Accounts"** to transfer between your own accounts.
    *   Select **"Another Account"** to send money to someone else by entering their **Account Number**.
5.  **History:** Check "Transaction History" to see your past activity.

## 🐳 Easy Setup with Docker

You can start the entire project (Frontend + Backend + Database) with a single command:

```bash
docker-compose up --build
```

- **Frontend:** `http://localhost:5173`
- **Backend:** `http://localhost:8080`
- **PostgreSQL:** `localhost:5432`

## 📚 API Endpoints
*   `POST /api/users/register` - Register
*   `POST /api/users/login` - Login
*   `POST /api/accounts` - Create Account
*   `GET /api/accounts/user/{userId}` - Get User Accounts
*   `POST /api/transactions/transfer` - Transfer Money

## 💡 Design Decisions & Requirement Notes

**Search Endpoint Resolution:**
The project requirements specified `POST /api/accounts` for *both* "Create Account" and "Search Accounts". Since two identical endpoints cannot coexist, I resolved this conflict by adhering to the standard RESTful pattern:
*   **Create:** `POST /api/accounts`
*   **Search:** `GET /api/accounts/search` (This also aligns with the frontend requirement to use "query parameters").


