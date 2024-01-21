import express from 'express';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employeeRoutes.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const app = express();

app.use(express.json());

app.use('/employees', employeeRoutes);

const PORT = 3000;

// catch all the routes that the application does not handle
app.use(notFound);

// error handler of the application
app.use(errorHandler);

app.listen(PORT, console.log(`The server is running on port ${PORT}`));
