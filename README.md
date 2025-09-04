# Discord Webhook Manager - Backend

This repository contains the backend services for the Discord Webhook Manager, a comprehensive application designed to streamline the management and sending of messages via Discord webhooks. Geared towards Discord server administrators, this project addresses the common challenges of creating announcements with custom avatars and usernames, eliminating the need for manual work, expensive paid bots, or complex custom bot development.

By providing a robust platform, the Discord Webhook Manager empowers server admins to effortlessly manage all their webhooks, create diverse avatars for various requirements, and utilize templates for quick message composition. It offers unparalleled convenience for making announcements, embedding rich content in messages, and even previewing how messages will appear directly within Discord.

This backend provides the API infrastructure that powers the frontend application, handling data persistence, authentication, and core business logic.

## 🚀 Features

The backend provides the following key functionalities, enabling the powerful features described above:

-   **User Authentication and Authorization**: Secure user registration, login, and session management, likely integrating with Discord's OAuth for seamless user experience.
-   **Discord Webhook Management**: API endpoints for creating, retrieving, updating, and deleting Discord webhooks associated with user accounts.
-   **Predefined Avatar Management**: Services to manage a collection of predefined avatars that users can utilize when composing messages.
-   **Message Template Management**: Functionality to create, store, and retrieve reusable message templates, supporting rich content like embeds.
-   **Discord Message Sending**: API to send messages to Discord channels using configured webhooks, incorporating selected avatars and saved templates.
-   **User Settings and Preferences**: Management of various user-specific application settings.

## 💻 Technical Stack

The backend is built with a modern and scalable technology stack:

-   **Framework**: [Fastify](https://www.fastify.io/) - A fast and low-overhead web framework for Node.js.
-   **Language**: [TypeScript](https://www.typescriptlang.org/) - For type safety and enhanced developer experience.
-   **Database**: [MongoDB](https://www.mongodb.com/) - A NoSQL document database.
-   **ODM**: [Mongoose](https://mongoosejs.com/) - MongoDB object data modeling for Node.js.
-   **Authentication**: [JWT (JSON Web Tokens)](https://jwt.io/) - For secure API authentication.
-   **File Storage**: [Cloudinary](https://cloudinary.com/) - For cloud-based image and video management (likely for avatars).
-   **Logging**: [Winston](https://github.com/winstonjs/winston) - A versatile logging library.
-   **Environment Variables**: [Dotenv](https://github.com/motdotla/dotenv) - For managing environment-specific configurations.

## 🌐 Frontend Context

This backend serves a frontend application built with:

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Library**: [React](https://react.dev/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Data Fetching**: [@tanstack/react-query](https://tanstack.com/query/latest)
-   **UI Components**: A component library based on [@radix-ui](https://www.radix-ui.com/)

The frontend provides a web-based interface for users to:
1.  **Manage Discord Webhooks**: Create, view, edit, and delete their Discord webhooks.
2.  **Manage Predefined Avatars**: Define and manage a collection of avatars that can be used when sending messages via webhooks.
3.  **Manage Message Templates**: Create and save reusable message templates, likely including rich content like embeds, to streamline their message sending process.
4.  **Send Discord Messages**: Compose and send messages to Discord channels using their configured webhooks, selected avatars, and saved templates. It likely includes a real-time preview of how the message will appear on Discord.
5.  **Authentication**: The application includes an authentication system, probably integrating with Discord's OAuth, to manage user access.
6.  **User Settings**: Configure various application settings.

## 📁 Project Structure

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

## 🛠️ Prerequisites

-   **Node.js** (v16 or higher)
-   **MongoDB** (local installation or MongoDB Atlas)

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd discord-webhook-manager-backend
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```
    *(If `pnpm-lock.yaml` exists, use `pnpm install`)*

3.  **Set up environment variables**
    ```bash
    cp .env.example .env
    ```
    Edit `.env` file with your configuration. Essential variables include:
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

4.  **Start MongoDB** (if using local installation)
    ```bash
    # macOS with Homebrew
    brew services start mongodb-community

    # Ubuntu/Debian
    sudo systemctl start mongod

    # Or use Docker
    docker run -d -p 27017:27017 --name mongodb mongo:latest
    ```

## 🚀 Usage

### Development
```bash
# Start development server with hot reload
npm run dev
```

### Production
```bash
# Build the project
npm run build

# Start production server
npm start
```

### Testing
```bash
# Run tests
npm test
```

## 🔧 Configuration

The project uses `dotenv` for environment variable management. Refer to the `.env.example` file for a list of configurable options.

## 🔒 Security Considerations

-   Use environment variables for sensitive data.
-   Implement proper authentication and authorization.
-   Validate all user inputs.
-   Use HTTPS in production.
-   Implement rate limiting.
-   Add CORS configuration as needed.

## 📈 Deployment

### Docker (Recommended)
Create a `Dockerfile` (example):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 4000
CMD ["npm", "start"]
```

### Traditional Deployment
1.  Build the project: `npm run build`
2.  Copy `dist/`, `package.json`, and `package-lock.json` to server
3.  Install production dependencies: `npm ci --only=production`
4.  Start the server: `npm start`

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
