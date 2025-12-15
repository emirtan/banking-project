# 🏦 Banking App - Frontend

This is the **Frontend** application for the Banking App, built with **React**, **TypeScript**, and **Vite**. It provides a modern, responsive user interface for users to manage their bank accounts, perform transfers, and view transaction history.

## 🚀 Features

*   **Authentication:** Secure Login & Registration pages.
*   **Dashboard:** Overview of user accounts and balances.
*   **Account Management:**
    *   Create new accounts.
    *   Edit account details.
    *   Delete accounts.
    *   Search/Filter accounts.
*   **Transactions:**
    *   Money Transfer between accounts.
    *   Detailed Transaction History (per account and global).
*   **UI/UX:**
    *   Responsive design with **Tailwind CSS**.
    *   Modern components using **Shadcn UI**.
    *   Form validation with **React Hook Form** & **Zod**.
    *   Toast notifications for user feedback.

## 🛠️ Tech Stack

*   **Framework:** [React](https://react.dev/)
*   **Build Tool:** [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **UI Library:** [Shadcn UI](https://ui.shadcn.com/)
*   **State Management:**
    *   [Zustand](https://github.com/pmndrs/zustand) (Client state)
    *   [TanStack Query](https://tanstack.com/query/latest) (Server state)
*   **Forms:** [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
*   **Routing:** [React Router DOM](https://reactrouter.com/)
*   **HTTP Client:** [Axios](https://axios-http.com/)

## ⚙️ Setup & Installation

### Prerequisites
*   Node.js 18+
*   npm

### 1. Installation

Navigate to the `banking-frontend` directory and install dependencies:

```bash
cd banking-frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root of `banking-frontend` (or check if it exists) to define the API URL:

```env
VITE_API_URL=http://localhost:8080/api
```

### 3. Run Locally

Start the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

## 🐳 Docker

You can run the frontend as a standalone container (served via Nginx).

### Build & Run
```bash
# Build the image
docker build -t banking-frontend .

# Run the container (Mapping port 5173 to container's 80)
docker run -p 5173:80 banking-frontend
```

*Note: For the full stack experience (Frontend + Backend + DB), please use the `docker-compose.yml` in the project root.*

## 📂 Project Structure

```
src/
├── components/      # Reusable UI components (Layout, UI kit, Dialogs)
├── lib/             # Utilities (API client, utils)
├── pages/           # Page components (Login, Dashboard, Transfer, etc.)
├── services/        # API service calls separation
├── store/           # Global state (Zustand)
├── types/           # TypeScript interfaces and Enum definitions
├── App.tsx          # Main App component & Routing
└── main.tsx         # Entry point
```
