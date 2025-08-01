import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import config from './config/env';
import connectDB from './config/database';

// Initialize Express app
const app: Express = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
connectDB();

// Simple route for testing
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to AppointmentLinker API' });
});

// Start server
const PORT = config.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
