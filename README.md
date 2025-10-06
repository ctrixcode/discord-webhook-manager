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
-   **Discord Webhook Library**: We maintain our own in-house library for handling Discord webhook interactions. If you need to add a feature that requires changes to the webhook functionality, you may need to contribute to this library as well. You can find the repository here: [discord-webhook-library](https://github.com/ctrixcode/discord-webhook-library).

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
    cd discord-webhook-manager
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

    **Discord OAuth Credentials:**
    You must create your own Discord application at [https://discord.com/developers/applications](https://discord.com/developers/applications) and obtain your Client ID, Client Secret, and set up a Redirect URI.

    **Cloudinary Credentials:**
    You must create a Cloudinary account at [https://cloudinary.com/](https://cloudinary.com/) and obtain your credentials.

     **Mongodb Credentials:**
    You need mongodb installed locally or in the cloud. You can use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or [MongoDB Community](https://www.mongodb.com/try/download/community) for a free tier.

    ```env
    PORT=4000
    MONGODB_URL=mongodb://localhost:27017/discord-webhook-manager
    NODE_ENV=development
    JWT_SECRET=your-super-secret-jwt-key
    DISCORD_CLIENT_ID=your_discord_client_id
    DISCORD_CLIENT_SECRET=your_discord_client_SECRET
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
    *   **Recommendation for Windows Users:** For a simpler setup, especially on Windows, consider using **MongoDB Atlas** (MongoDB's cloud service). You can create a free-tier cluster and obtain a connection string. Update your `MONGODB_URL` in `apps/backend/.env` with this connection string.
    ```bash
    # macOS with Homebrew
    brew services start mongodb-community

    # Ubuntu/Debian
    sudo systemctl start mongod

    # Or use Docker
    docker run -d -p 27017:27017 --name mongodb mongo:latest
    ```
    *For detailed local installation instructions for Windows, please refer to the official MongoDB documentation.*

### 🚀 Usage

From the root of the monorepo:

#### Development

To run both frontend and backend in development mode (using Turborepo):
```bash
pnpm dev
```

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

## 📈 Deployment

This monorepo can be deployed to Vercel.

-   **Frontend (`apps/web`)**: Deploy directly to Vercel, specifying `apps/web` as the root directory. Vercel's native Next.js support will handle the rest.
    *   **Important for Vercel Deployment:** Due to Vercel's default `NODE_ENV=production` setting during builds, you must explicitly set the "Install Command" in your Vercel project settings for the frontend to `pnpm install --prod=false`. This ensures `devDependencies` (like `typescript`) are installed correctly.
-   **Backend (`apps/backend`)**: Deploy to Vercel as Serverless Functions, specifying `apps/backend` as the root directory. Ensure you have a `vercel.json` file in `apps/backend` to configure the build and routing for the API.

## 🤝 Contributing

We welcome contributions to this project! Please see our [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines on how to contribute, report bugs, and suggest features.

## 📄 License

This project is licensed under the GNU General Public License v3.0.

## 🆘 Support

If you encounter any issues or have questions:
1.  Join our Discord server for community support: [https://discord.gg/YbtyTRAFv2](https://discord.gg/YbtyTRAFv2)
2.  Check the existing issues
3.  Create a new issue with detailed information
4.  Provide steps to reproduce the problem

---

**Happy Coding! 🎉**