import mongoose from 'mongoose';
import config from './env';

// MongoDB connection options
const options = {
  autoIndex: true,
  serverSelectionTimeoutMS: 10000, // Timeout after 10s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  family: 4, // Use IPv4, skip IPv6
  retryWrites: true,
  retryReads: true,
};

// Set up mongoose connection events
mongoose.connection.on('connected', () => {
  console.log('MongoDB connection established successfully');
});

mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err}`);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB connection disconnected');
});

// Gracefully handle process termination
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

// Connect to MongoDB with retry logic
const connectDB = async (retries = 5, delay = 5000): Promise<void> => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI, options);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);

    if (retries === 0) {
      if (config.NODE_ENV === 'production') {
        console.error('Failed to connect to MongoDB. Exiting application.');
        process.exit(1);
      } else {
        console.warn('Failed to connect to MongoDB, but continuing in development mode');
        return;
      }
    }

    console.log(`Retrying connection in ${delay / 1000} seconds...`);
    setTimeout(() => connectDB(retries - 1, delay), delay);
  }
};

// Test database connection
export const testConnection = async (): Promise<void> => {
  try {
    if (mongoose.connection.readyState === 0) {
      await connectDB();
    }
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};

export default connectDB;
