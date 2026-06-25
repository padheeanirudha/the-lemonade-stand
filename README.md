# 🍋 The Lemonade Stand — Full-Stack Shopping Cart

A pixel-perfect, highly responsive minimalist shopping cart application built using a decoupled architecture with a modern React frontend and a robust backend graph pipeline.

## 🚀 Tech Stack

- **Frontend:** React, Vite, JavaScript (ES6+), Inline CSS Design Matrix
- **Backend:** C# / .NET Web API, HotChocolate (GraphQL Server Engine)
- **Data Layer:** Persistent Transaction Engine (Entity Framework / Local Mock Matrices)
- **Development Environment:** GitHub Codespaces

---

## 🛠️ System Architecture & Data Flow

The application maps out a cohesive $2 \times 2$ product option matrix dynamically rendered through localized functional view components.

+-----------------------------------------------------------+
|                      React Frontend                       |
|                       (Port 5173)                         |
+-----------------------------+-----------------------------+
|
GraphQL Operations
|
v
+-----------------------------------------------------------+
|                  GitHub Codespaces Proxy                  |
|                 (Port 5070 Set to Public)                 |
+-----------------------------+-----------------------------+
|
v
+-----------------------------------------------------------+
|                     C# / .NET Backend                     |
|                 (GraphQL Endpoint Pipeline)               |
+-----------------------------------------------------------+


1. **Hydration Phase:** On initial client engine compilation or hard page refresh, the frontend hooks dispatch a query operation (`GetCart`) to sync data state directly from persistent storage.
2. **State Resiliency:** Modifications to the cart array map down local hardware cache (`localStorage`) updates alongside concurrent backend network mutations to ensure zero tracking data volatility.
3. **Recovery Tracking Engine:** Contains an integrated state restoration module that identifies deleted matrix variants and dynamically exposes categorical data recovery handlers.

---

## 🔧 Installation & Environment Configuration

### 1. Networking Infrastructure (GitHub Codespaces Proxy Setup)
Because GitHub Codespaces runs behind an isolated secure proxy interface, the backend port must be explicitly exposed to prevent browser Preflight errors (`CORS`).

1. Open the **Ports** panel tab in your active workspace terminal interface.
2. Locate **Port 5070** (Backend Application Layer).
3. Right-click the **Visibility** configuration column field and toggle it from **Private** to **Public**.

### 2. Running the Front-End Core
Navigate down into the user interface directory path and kick off the Vite hot-reloading development server script:

```bash
cd lemonade-ui
npm install
npm run dev