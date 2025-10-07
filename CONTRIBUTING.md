# Contributing to Discord Webhook Manager

We welcome contributions to the Discord Webhook Manager project! By contributing, you help us improve and expand this project for everyone.

Please take a moment to review this document to make the contribution process as smooth as possible.

## Why Contribute?
Your contributions are invaluable to the Discord Webhook Manager project! By contributing, you help us:
*   **Improve and Expand:** Add new features, fix bugs, and enhance existing functionality.
*   **Learn and Grow:** Collaborate with other developers and learn new skills.
*   **Make an Impact:** Help create a better tool for Discord server administrators and users.

We appreciate your time and effort, and we're excited to have you as part of our community!

## Code of Conduct

Please note that this project is released with a Contributor Code of Conduct. By participating in this project, you agree to abide by its terms.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue on GitHub. When reporting a bug, please include:

*   A clear and concise description of the bug.
*   Steps to reproduce the behavior.
*   Expected behavior.
*   Screenshots or error messages if applicable.
*   Your environment details (OS, Node.js version, browser, etc.).

### Suggesting Enhancements

We love new ideas! If you have a suggestion for an enhancement or a new feature, please open an issue on GitHub. Describe your idea clearly and explain why you think it would be beneficial.

### Good First Issues

If you're looking for a good place to start contributing, check out our [Good First Issues](https://github.com/ctrixcode/discord-webhook-manager/labels/good%20first%20issue) on GitHub. These are tasks specifically designed for new contributors to get familiar with the codebase.

## Technical Stack

### Frontend Technologies
*   Next.js
*   React
*   TypeScript
*   TanStack Query
*   Radix UI
*   Tailwind CSS

### Backend Technologies
The backend is built with a modern and scalable technology stack:

-   **Framework**: Fastify
-   **Language**: TypeScript
-   **Database**: MongoDB
-   **ODM**: Mongoose
-   **Authentication**: JWT (JSON Web Tokens)
-   **File Storage**: Cloudinary
-   **Logging**: Winston
-   **Environment Variables**: Dotenv
-   **Discord Webhook Library**: We maintain our own in-house library for handling Discord webhook interactions. If you need to add a feature that requires changes to the webhook functionality, you may need to contribute to this library as well. You can find the repository here: [discord-webhook-library](https://github.com/ctrixcode/discord-webhook-library).
    *   **Workflow for Library Changes:** If your contribution requires changes to the `discord-webhook-library`, please open a Pull Request in that repository first. Once those changes are merged and a new version is released, you can then update the dependency in this project and proceed with your contribution here.

## Development Environment Setup

### Prerequisites

-   **Node.js** (v16 or higher) - *Required only if not using Docker*
-   **MongoDB** (local installation or MongoDB Atlas) - *Required only if not using Docker*
-   **pnpm** (recommended package manager for this project) - *Required only if not using Docker*
-   **Docker and Docker Compose** (recommended for simplified setup)

### Docker Setup (Recommended)

For the easiest and most consistent development experience, use Docker. This eliminates the need to install Node.js, MongoDB, or pnpm locally.

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd discord-webhook-manager
    ```

2.  **Set up environment variables**
    
    Docker Compose loads environment variables from multiple sources in this order (later sources override earlier ones):
    1. Root `.env` file (shared credentials like Discord, Cloudinary)
    2. App-specific `.env` files (`apps/backend/.env` and `apps/web/.env`)
    3. Environment variables defined in `docker-compose.yml`
    
    **Option A: Simple Setup (Recommended for beginners)**
    ```bash
    # Copy and edit only the root .env file
    cp .env.example .env
    nano .env  # Edit with your credentials
    ```
    
    The root `.env` file contains shared credentials:
    ```env
    # Discord OAuth2 - Get from https://discord.com/developers/applications
    DISCORD_CLIENT_ID=your_actual_discord_client_id
    DISCORD_CLIENT_SECRET=your_actual_discord_client_secret
    
    # Cloudinary - Get from https://cloudinary.com/
    CLOUDINARY_CLOUD_NAME=your_actual_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_actual_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_actual_cloudinary_api_secret
    
    # Encryption - Generate a random 32-character key
    ENCRYPTION_KEY=your_actual_32_character_encryption_key
    ```
    
    **Option B: Advanced Setup (For custom configurations)**
    ```bash
    # Set up root .env for shared credentials
    cp .env.example .env
    
    # Set up app-specific .env files for custom settings
    cp apps/backend/.env.example apps/backend/.env
    cp apps/web/.env.example apps/web/.env
    
    # Edit each file as needed
    nano .env
    nano apps/backend/.env
    nano apps/web/.env
    ```
    
    App-specific `.env` files can override defaults or add additional variables.
    For example, `apps/backend/.env` might override `PORT` or `LOG_LEVEL`.

3.  **Start the development environment**
    ```bash
    docker compose up --build
    ```

4.  **Access the applications**
    - Frontend: <http://localhost:3000>
    - Backend API: <http://localhost:4000>
    - MongoDB: localhost:27017

The Docker setup includes hot reloading, so changes to your code will automatically refresh the applications.

**Note for Windows/WSL2 users:** File watching is configured with polling to ensure reliable hot reloading across all operating systems.

### Manual Setup (Alternative)

If you prefer not to use Docker, follow these steps:

#### Prerequisites

-   **Node.js** (v16 or higher)
-   **MongoDB** (local installation or MongoDB Atlas)
-   **pnpm** (recommended package manager for this project)

#### Installation

1.  **Clone the repository**
    ```bash
    git clone <your-repo-url>
    cd discord-webhook-manager
    ```

2.  **Install dependencies for the entire project**
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
    # Server Configuration
    PORT=4000
    NODE_ENV=development

    # Database Configuration
    MONGO_URL=mongodb://localhost:27017/discord-webhook-manager

    # CORS Configuration
    ALLOWED_ORIGINS=http://localhost:3000

    # Security
    JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
    JWT_ACCESS_TOKEN_EXPIRES_IN=15m
    JWT_REFRESH_TOKEN_EXPIRES_IN=7d

    # Optional: Logging
    LOG_LEVEL=info

    # Discord OAuth2
    DISCORD_CLIENT_ID=your_discord_client_id
    DISCORD_CLIENT_SECRET=your_discord_client_secret
    DISCORD_REDIRECT_URI=http://localhost:3000/api/auth/discord/callback

    # Cloudinary Configuration
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret

    # Encryption
    ENCRYPTION_KEY=your_32_byte_encryption_key_here # Generate a random 32-character key
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
    *   **Recommendation for Windows Users:** For a simpler setup, especially on Windows, consider using **MongoDB Atlas** (MongoDB's cloud service). You can create a free-tier cluster and obtain a connection string. Update your `MONGO_URL` in `apps/backend/.env` with this connection string.
    ```bash
    # macOS with Homebrew
    brew services start mongodb-community

    # Ubuntu/Debian
    sudo systemctl start mongod

    # Or use Docker
    docker run -d -p 27017:27017 --name mongodb mongo:latest
    ```
    *For detailed local installation instructions for Windows, please refer to the official MongoDB documentation.*

### Usage

From the root of the project:

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

**Build the entire project:**
```bash
pnpm build
```

## Code Contributions

1.  **Fork the repository:** Start by forking the `discord-webhook-manager` repository to your GitHub account.
2.  **Clone your fork:**
    ```bash
    git clone https://github.com/YOUR_USERNAME/discord-webhook-manager.git
    cd discord-webhook-manager
    ```
3.  **Install dependencies:** This project uses `pnpm`.
    ```bash
    pnpm install
    ```
4.  **Create a new branch from `development`:**
    *   **Important:** All new features and bug fixes should be branched off the `development` branch. Do NOT branch directly from `launchpad` (our production branch).
    ```bash
    git checkout development
    git pull origin development # Ensure your development branch is up-to-date
    git checkout -b feature/your-feature-name
    # or
    git checkout -b bugfix/your-bug-fix-name
    ```
5.  **Make your changes:** Implement your feature or bug fix.
    *   Ensure your code adheres to the existing coding style. We use ESLint and Prettier.
    *   Write clear, concise, and well-documented code.
    *   Add or update tests for your changes.
6.  **Run tests:**
    ```bash
    pnpm test # or navigate to specific app and run pnpm test
    ```
7.  **Format and lint your code:**
    ```bash
    pnpm format:check # Check for formatting issues
    pnpm format # Fix formatting issues
    pnpm lint # Check for linting issues
    pnpm lint:fix # Fix linting issues
    ```
    *(These commands assume you have root-level scripts configured in `package.json` or `turbo.json` to run these across the project, or you can run them within `apps/web` or `apps/backend` directories.)*
8.  **Commit your changes:** Write a clear and descriptive commit message.

    **A note on pre-commit checks:** This project uses a pre-commit hook to ensure code quality and consistency. When you try to commit, it will automatically run ESLint and Prettier on all staged files. If any linting errors are found or files need reformatting, the commit will be aborted. You will need to fix the reported issues and `git add` the files again before you can successfully commit.

    ```bash
    git commit -m "feat: Add new feature X"
    # or
    git commit -m "fix: Resolve bug Y" 
    ```
9.  **Push to your fork:**
    ```bash
    git push origin feature/your-feature-name
    ```
10. **Open a Pull Request (PR) to `development`:**
    *   Go to the original `discord-webhook-manager` repository on GitHub and open a new pull request from your branch.
    *   **Ensure the base branch for your PR is `development`**, not `launchpad`.
    *   Provide a clear title and description for your PR.
    *   Reference any related issues.

## GitHub Contribution Guides

For detailed examples on how to use our Issue and Pull Request templates, and how to manage the `CHANGELOG.md`, please refer to our [GitHub Contribution Guides](./docs/github/README.MD).

## License

By contributing to Discord Webhook Manager, you agree that your contributions will be licensed under its GNU General Public License v3.0.

