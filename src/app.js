// import express from 'express';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';
// import path from 'path';
// import { fileURLToPath } from 'url';

// import authRoutes from './routes/auth.js';
// import departmentRoutes from './routes/departments.js';
// import inventoryRoutes from './routes/inventory.js';
// import ticketRoutes from './routes/tickets.js';
// import auditRoutes from './routes/audits.js';
// import userRoutes from './routes/users.js';
// import dashboardRoutes from './routes/dashboard.js';
// // const orderRoutes = require('./routes/orderRoutes');
// import orderRoutes from './routes/orderRoutes.js'; // ✅ Use import
// const __dirname = path.dirname(fileURLToPath(import.meta.url));

// const app = express();

// app.use(
//   cors({
//     origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//     credentials: true,
//   })
// );
// app.use(cookieParser());
// app.use(express.json());
// app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// app.use('/api/auth', authRoutes);
// app.use('/api/departments', departmentRoutes);
// app.use('/api/inventory', inventoryRoutes);
// app.use('/api/tickets', ticketRoutes);
// app.use('/api/audits', auditRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/dashboard', dashboardRoutes);
// app.use('/api/orders', orderRoutes);
// app.use((err, req, res, next) => {
//   console.error(err);
//   res.status(err.status || 500).json({ message: err.message || 'Server error' });
// });

// export default app;






import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

// Route Imports
import authRoutes from './routes/auth.js';
import departmentRoutes from './routes/departments.js';
import inventoryRoutes from './routes/inventory.js';
import ticketRoutes from './routes/tickets.js';
import auditRoutes from './routes/audits.js';
import userRoutes from './routes/users.js';
import dashboardRoutes from './routes/dashboard.js';
import orderRoutes from './routes/orderRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes); // Mounts the PATCH /:id route
app.use('/api/inventory', inventoryRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/audits', auditRoutes);
app.use('/api/users', userRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/orders', orderRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal Server Error' 
  });
});

export default app;