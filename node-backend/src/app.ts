import express from 'express';
import { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';
import connectDb from './config/database';

// Initialize express app
const app = express();

// Connect to MongoDB database
connectDb();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', routes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

export default app;
