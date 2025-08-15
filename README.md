# Express.js + TypeScript + MongoDB Template

A modern, scalable Node.js API template built with Express.js, TypeScript, and MongoDB. This template provides a solid foundation for building RESTful APIs with proper project structure, type safety, and database integration.

## 🚀 Features

- **TypeScript** - Full type safety and modern JavaScript features
- **Express.js** - Fast, unopinionated web framework for Node.js
- **MongoDB with Mongoose** - NoSQL database with ODM for data modeling
- **Project Structure** - Well-organized folder structure following best practices
- **Development Tools** - Hot reloading with nodemon and ts-node
- **Testing Setup** - Pre-configured test directories for unit and integration tests
- **Environment Configuration** - Dotenv support for environment variables

## 📁 Project Structure

```
express-ts-mongo/
├── src/
│   ├── app.ts                 # Express app configuration
│   ├── server.ts              # Server entry point
│   ├── config/                # Configuration files
│   ├── constants/             # Application constants
│   ├── controllers/           # Route controllers
│   ├── middlewares/           # Custom middleware
│   ├── models/                # Mongoose models
│   ├── routes/                # API routes
│   ├── services/              # Business logic
│   ├── utils/                 # Utility functions
│   └── validators/            # Request validation
├── tests/
│   ├── integration/           # Integration tests
│   └── unit/                  # Unit tests
├── dist/                      # Compiled JavaScript (generated)
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd express-ts-mongo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/your-database
   NODE_ENV=development
   ```

4. **Start MongoDB** (if using local installation)
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
# Run tests (when implemented)
npm test
```

## 🔧 Configuration

### TypeScript Configuration
The project uses a strict TypeScript configuration (`tsconfig.json`) with:
- ES2016 target
- CommonJS modules
- Strict type checking
- Source maps for debugging
- Root directory: `./src`
- Output directory: `./dist`

### Package Scripts
- `dev` - Start development server with nodemon and ts-node
- `build` - Compile TypeScript to JavaScript
- `start` - Run the compiled JavaScript in production
- `test` - Run tests (placeholder)

## 📚 Dependencies

### Production Dependencies
- **express** (^5.1.0) - Web framework
- **mongoose** (^8.16.0) - MongoDB ODM
- **dotenv** (^16.5.0) - Environment variable management

### Development Dependencies
- **typescript** (^5.8.3) - TypeScript compiler
- **ts-node** (^10.9.2) - TypeScript execution engine
- **nodemon** (^3.1.10) - Development server with auto-restart
- **@types/express** (^5.0.3) - Express type definitions
- **@types/mongoose** (^5.11.97) - Mongoose type definitions
- **@types/node** (^24.0.3) - Node.js type definitions

## 🏗️ Project Setup

The template follows a standard MVC pattern:

- **Models** (`src/models/`) - Mongoose schemas and models
- **Controllers** (`src/controllers/`) - Route handlers and business logic
- **Routes** (`src/routes/`) - API endpoint definitions
- **Middleware** (`src/middlewares/`) - Custom Express middleware
- **Services** (`src/services/`) - Reusable business logic
- **Utils** (`src/utils/`) - Helper functions and utilities
- **Validators** (`src/validators/`) - Request validation schemas

## 🧪 Testing

The project includes a testing structure with:
- `tests/unit/` - For unit tests
- `tests/integration/` - For integration tests

To implement testing, consider adding:
- **Jest** or **Mocha** for test framework
- **Supertest** for API testing
- **@types/jest** for TypeScript support

## 📝 Environment Variables

Create a `.env` file in the root directory:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/your-database
NODE_ENV=development
JWT_SECRET=your-jwt-secret
```

## 🔒 Security Considerations

- Use environment variables for sensitive data
- Implement proper authentication and authorization
- Validate all user inputs
- Use HTTPS in production
- Implement rate limiting
- Add CORS configuration as needed

## 📈 Deployment

### Docker (Recommended)
Create a `Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["npm", "start"]
```

### Traditional Deployment
1. Build the project: `npm run build`
2. Copy `dist/`, `package.json`, and `package-lock.json` to server
3. Install production dependencies: `npm ci --only=production`
4. Start the server: `npm start`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the existing issues
2. Create a new issue with detailed information
3. Provide steps to reproduce the problem

## 🔄 Updates

Keep your dependencies updated:
```bash
# Check for outdated packages
pnpm outdated

# Update dependencies
pnpm update
```

---

**Happy Coding! 🎉** 