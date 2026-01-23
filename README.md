# Next Admin

A premium, responsive admin dashboard boilerplate built with Next.js 15, Prisma, and Material UI.

## 📚 Documentation

Detailed documentation is available in the `docs` folder:

- [Dashboard Layout & Components](docs/DASHBOARD_LAYOUT.md)
- [Deployment & Migrations](docs/deployment.md)

## 🚀 Quick Start

1.  **Install dependencies:**

    ```bash
    yarn install
    ```

2.  **Environment Setup:**
    Copy `.env.example` to `.env` and configure your database connection.

    ```bash
    cp .env.example .env
    ```

3.  **Database Setup:**

    ```bash
    yarn db:seed
    ```

4.  **Run Development Server:**

    ```bash
    yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to view the app.

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database:** Prisma ORM
- **UI:** Material UI (MUI) v6
- **Authentication:** Supabase / Custom Auth
- **State Management:** Redux Toolkit

## 🚢 Deployment

This project is configured for seamless deployment on Vercel and AWS Amplify using `amplify.yml`.
See the [Deployment Guide](docs/deployment.md) for safe migration strategies.
