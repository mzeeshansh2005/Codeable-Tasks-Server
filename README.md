# Task Management App - Server

A robust backend server for a task management application built with Node.js, Express, TypeScript, MongoDB, and Firebase Authentication.

## 🚀 Features

- **RESTful API** - Clean and scalable API architecture
- **Firebase Authentication** - Secure user authentication with Firebase Admin SDK
- **MongoDB Database** - Flexible NoSQL database with Mongoose ODM
- **TypeScript** - Type-safe code with full TypeScript support
- **Issue Tracking** - Create and manage tasks, bugs, stories, and epics
- **Project Management** - Organize work into projects and teams
- **Workflow Status** - Customizable workflow statuses for issues
- **Comments System** - Collaborative commenting on issues
- **Priority Management** - Set priorities (Highest, High, Medium, Low, Lowest)

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or remote instance)
- Firebase project with Admin SDK credentials

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   cd /home/ackerman/Documents/Work/Task\ Management\ App/server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # MongoDB Configuration
   MONGO_URI=mongodb://localhost:27017/issue-tracker

   # Firebase Admin SDK Configuration
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project-id.iam.gserviceaccount.com
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
   ```

   See [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) for detailed Firebase setup instructions.

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```
Runs the server with hot-reload using `tsx watch`.

### Production Build
```bash
npm run build
npm start
```
Builds TypeScript to JavaScript and runs the compiled code.

### Code Formatting
```bash
npm run format        # Format code
npm run format:check  # Check formatting
```

## 📁 Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── config.ts           # Application configuration
│   ├── controllers/
│   │   ├── forYou.ts          # For You page controllers
│   │   └── user.ts            # User controllers
│   ├── lib/
│   │   ├── firebase.ts        # Firebase Admin initialization
│   │   └── mongodb.ts         # MongoDB connection
│   ├── middleware/
│   │   └── auth.ts            # Authentication middleware
│   ├── models/
│   │   ├── Comment.ts         # Comment model
│   │   ├── Issue.ts           # Issue/Task model
│   │   ├── Project.ts         # Project model
│   │   ├── Team.ts            # Team model
│   │   ├── User.ts            # User model
│   │   └── WorkflowStatus.ts  # Workflow status model
│   ├── routes/
│   │   ├── forYou.ts          # For You routes
│   │   └── user.ts            # User routes
│   └── server.ts              # Application entry point
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Health Check
```
GET /health
```
Returns server status and timestamp.

### Users
```
GET    /api/v1/users       # Get all users (protected)
GET    /api/v1/users/:id   # Get user by ID (protected)
```

### For You
```
GET    /api/v1/for-you     # Get personalized content (protected)
```

### Coming Soon
- Projects API
- Issues API
- Comments API
- Workflow Statuses API
- Teams API

## 🔐 Authentication

This server uses Firebase Authentication. All protected routes require a valid Firebase ID token in the Authorization header:

```bash
curl -X GET http://localhost:3000/api/v1/users \
  -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN" \
  -H "Content-Type: application/json"
```

For detailed authentication setup and usage, see [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md).

## 📊 Data Models

### Issue
- **Type**: Task, Bug, Story, Epic
- **Priority**: Highest, High, Medium, Low, Lowest
- **Status**: Links to WorkflowStatus
- **Assignee/Reporter**: References User
- **Project**: References Project
- **Comments**: Array of Comment references
- **Attachments**: Array of file URLs
- **Estimate**: Story points or time estimate

### Project
- Organization unit for issues
- Contains workflow statuses
- Associated with teams

### Team
- Group of users collaborating on projects

### User
- Authenticated users from Firebase
- Can be assignees or reporters

### WorkflowStatus
- Customizable status columns (e.g., To Do, In Progress, Done)

### Comment
- User comments on issues
- Timestamps for creation/updates

## 🔧 Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Language**: TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Firebase Admin SDK
- **Dev Tools**: tsx, nodemon, prettier

## 📝 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production server |
| `npm run format` | Format code with Prettier |
| `npm run format:check` | Check code formatting |
| `npm test` | Run tests (not yet configured) |

## 🚧 Development Status

Currently implemented:
- ✅ Server setup and configuration
- ✅ MongoDB connection
- ✅ Firebase authentication
- ✅ User routes and controllers
- ✅ Data models (Issue, Project, Team, User, WorkflowStatus, Comment)
- ✅ For You personalized content

Coming soon:
- 🔲 Complete CRUD operations for all models
- 🔲 Advanced filtering and search
- 🔲 Real-time updates
- 🔲 File upload for attachments
- 🔲 Unit and integration tests

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Format your code: `npm run format`
4. Test your changes
5. Submit a pull request

## 📄 License

ISC

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `sudo systemctl status mongod`
- Check MONGO_URI in `.env` file
- Verify network connectivity

### Firebase Authentication Errors
- Verify Firebase credentials in `.env`
- Ensure private key is properly formatted with newlines
- Check Firebase Console for service account status

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>
```

## 📞 Support

For issues and questions, please check:
- [AUTHENTICATION_SETUP.md](./AUTHENTICATION_SETUP.md) for auth-related issues
- MongoDB documentation: https://docs.mongodb.com/
- Firebase Admin SDK: https://firebase.google.com/docs/admin/setup

---

**Made with ❤️ for efficient task management**

