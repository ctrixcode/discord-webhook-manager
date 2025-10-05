# Discord Webhook Manager - Monorepo

The Discord Webhook Manager is a powerful and intuitive platform designed to streamline and enhance how Discord server administrators and users manage their server announcements and messages. It eliminates the need for manual work, expensive paid bots, or complex custom bot development by providing a centralized, user-friendly interface for all your Discord messaging needs.

This monorepo contains two main applications:
- **`apps/web`**: The Next.js frontend application providing the user interface.
- **`apps/backend`**: The Node.js (Fastify) backend API services.

## Problem Solved

Discord server administrators often face challenges when trying to send custom announcements with unique avatars and usernames. This typically requires:

*   **Manual Work**: Tediously creating and sending messages through webhooks for each announcement.
*   **Paid Bots**: Investing in premium bot services that offer custom messaging features.
*   **Custom Bots**: Developing and maintaining their own custom Discord bots, which can be time-consuming and require technical expertise.

The Discord Webhook Manager addresses these pain points by offering a free, convenient, and feature-rich alternative.

## Frontend: Discord Webhook Manager (Web App)

This is the user-facing application that provides a comprehensive dashboard for managing Discord webhooks, avatars, and message templates.

### Key Features (Frontend)
*   **Comprehensive Webhook Management**: Easily create, view, edit, and delete all your Discord webhooks from a single dashboard.
*   **Custom Avatar Creation**: Design and save multiple custom avatars for different announcement types or personas, allowing for dynamic and engaging messaging.
*   **Reusable Message Templates**: Create and store message templates, including rich embeds, to quickly send recurring announcements or pre-formatted content.
*   **Intuitive Message Composer**: Compose messages with a user-friendly interface, incorporating custom avatars, usernames, and embeds.
*   **Real-time Discord Preview**: See exactly how your message will appear on Discord before you send it, ensuring perfect formatting and presentation.
*   **No Coding Required**: A completely no-code solution, making advanced Discord messaging accessible to everyone.
*   **Cost-Effective**: Eliminate the need for paid bot subscriptions or the overhead of custom bot development.

### Technologies Used (Frontend)
*   Next.js
*   React
*   TypeScript
*   TanStack Query
*   Radix UI
*   Tailwind CSS

## Backend: Discord Webhook Manager (API)

This backend provides the API infrastructure that powers the frontend application, handling data persistence, authentication, and core business logic.

### 🚀 Features (Backend)
The backend provides the following key functionalities:

-   **User Authentication and Authorization**: Secure user registration, login, and session management, likely integrating with Discord's OAuth for seamless user experience.
-   **Discord Webhook Management**: API endpoints for creating, retrieving, updating, and deleting Discord webhooks associated with user accounts.
-   **Predefined Avatar Management**: Services to manage a collection of predefined avatars that users can utilize when composing messages.
-   **Message Template Management**: Functionality to create, store, and retrieve reusable message templates, supporting rich content like embeds.
-   **Discord Message Sending**: API to send messages to Discord channels using configured webhooks, incorporating selected avatars and saved templates.
-   **User Settings and Preferences**: Management of various user-specific application settings.

### 💻 Technical Stack (Backend)
The backend is built with a modern and scalable technology stack:

-   **Framework**: [Fastify](https://www.fastify.io/) - A fast and low-overhead web framework for Node.js.
-   **Language**: [TypeScript](https://www.typescriptlang.org/) - For type safety and enhanced developer experience.
-   **Database**: [MongoDB](https://www.mongodb.com/) - A NoSQL document database.
-   **ODM**: [Mongoose](https://mongoosejs.com/) - MongoDB object data modeling for Node.js.
-   **Authentication**: [JWT (JSON Web Tokens)](https://jwt.io/) - For secure API authentication.
-   **File Storage**: [Cloudinary](https://cloudinary.com/) - For cloud-based image and video management (likely for avatars).
-   **Logging**: [Winston](https://github.com/winstonjs/winston) - A versatile logging library.
-   **Environment Variables**: [Dotenv](https://github.com/motdotla/dotenv) - For managing environment-specific configurations.

### 📁 Project Structure (Backend)

```
discord-webhook-manager-backend/
├── src/
│   ├── app.ts                 # Fastify app configuration
│   ├── server.ts              # Server entry point
│   ├── config/                # Configuration files (DB, usage limits)
│   ├── controllers/           # Route handlers and business logic
│   ├── middlewares/           # Custom Fastify middleware
│   ├── models/                # Mongoose schemas and models
│   ├── routes/                # API endpoint definitions
│   ├── services/              # Reusable business logic
│   ├── schemas/               # Validation schemas (e.g., Zod)
│   ├── utils/                 # Utility functions (JWT, errors, logging)
│   └── types/                 # TypeScript custom types
├── tests/                     # Unit and integration tests
├── dist/                      # Compiled JavaScript (generated)
├── package.json               # Project metadata and dependencies
├── tsconfig.json              # TypeScript configuration
└── README.md                  # Project documentation
```

## Getting Started (Monorepo)

### 🛠️ Prerequisites

-   **Node.js** (v16 or higher)
-   **MongoDB** (local installation or MongoDB Atlas)
-   **pnpm** (recommended package manager for this monorepo)

### 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd monorepo
    ```

2.  **Install dependencies for the entire monorepo**
    ```bash
    pnpm install
    ```

3.  **Set up environment variables for the backend**
    Navigate to `apps/backend` and copy the example environment file:
    ```bash
    cd apps/backend
    cp .env.example .env
    ```
    Edit the `.env` file with your configuration. Essential variables include:
    ```env
    PORT=4000
    MONGODB_URI=mongodb://localhost:27017/discord-webhook-manager
    NODE_ENV=development
    JWT_SECRET=your-super-secret-jwt-key
    DISCORD_CLIENT_ID=your_discord_client_id
    DISCORD_CLIENT_SECRET=your_discord_client_secret
    DISCORD_REDIRECT_URI=http://localhost:3000/auth/callback # Frontend callback URL
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    ```

4.  **Set up environment variables for the frontend**
    Navigate to `apps/web` and copy the example environment file:
    ```bash
    cd apps/web
    cp .env.example .env
    ```
    Edit the `.env` file with your configuration. Essential variables include:
    ```env
    NODE_ENV=development
    NEXT_PUBLIC_API_URL=http://localhost:4000 # Or your deployed backend URL
    ```
    `NEXT_PUBLIC_API_URL` should point to your backend API. During local development, this will typically be `http://localhost:4000`.

4.  **Start MongoDB** (if using local installation)
    ```bash
    # macOS with Homebrew
    brew services start mongodb-community

    # Ubuntu/Debian
    sudo systemctl start mongod

    # Or use Docker
    docker run -d -p 27017:27017 --name mongodb mongo:latest
    ```

### 🚀 Usage

From the root of the monorepo:

#### Development

To run both frontend and backend in development mode (using Turborepo):
```bash
pnpm dev
```
*(This assumes you have `dev` scripts configured in your root `package.json` or `turbo.json` to run both `apps/web` and `apps/backend` dev servers.)*

Alternatively, you can run them separately:

**Backend Development:**
```bash
cd apps/backend
pnpm dev
```

**Frontend Development:**
```bash
cd apps/web
pnpm dev
```

#### Production

**Build the entire monorepo:**
```bash
pnpm build
```
*(This assumes a `build` script in your root `package.json` or `turbo.json` to build both `apps/web` and `apps/backend`.)*

## 📈 Deployment

This monorepo can be deployed to Vercel.

-   **Frontend (`apps/web`)**: Deploy directly to Vercel, specifying `apps/web` as the root directory. Vercel's native Next.js support will handle the rest.
-   **Backend (`apps/backend`)**: Deploy to Vercel as Serverless Functions, specifying `apps/backend` as the root directory. Ensure you have a `vercel.json` file in `apps/backend` to configure the build and routing for the API.

## 🤝 Contributing

1.  Fork the repository
2.  Create a feature branch
3.  Make your changes
4.  Add tests if applicable
5.  Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:
1.  Check the existing issues
2.  Create a new issue with detailed information
3.  Provide steps to reproduce the problem

---

**Happy Coding! 🎉**