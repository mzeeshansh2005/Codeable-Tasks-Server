import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import config from './config/config.js';
import { connectDB } from './lib/mongodb.js';
const app: Application = express();
import userRouter from './routes/user.js';
import forYouRouter from './routes/forYou.js';
import projectRouter from './routes/project.js';
import issueRouter from './routes/issue.js';
import teamRouter from './routes/team.js';

app.use(
  cors({
    origin: '*', // Allow all origins
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/v1/users', userRouter);
app.use('/api/v1/for-you', forYouRouter);
app.use('/api/v1/projects', projectRouter);
app.use('/api/v1/issues', issueRouter);
app.use('/api/v1/teams', teamRouter);
// app.use('/api/v1/comments', commentRoutes);
// app.use('/api/v1/workflow-statuses', workflowStatusRoutes);

// Start server
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Then start the server
    app.listen(config.port, () => {
      console.log(`🚀 Server is running on port ${config.port}`);
      console.log(`📝 Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
