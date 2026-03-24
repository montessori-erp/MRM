// import dotenv from 'dotenv';
// import { connectDB } from './config/db.js';
// import app from './app.js';
// import { startThresholdCron } from './jobs/thresholdAlerts.js';

// dotenv.config();

// const PORT = process.env.PORT || 5000;

// connectDB().then(() => {
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
//   startThresholdCron();
// });





import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import app from './app.js';
import { startThresholdCron } from './jobs/thresholdAlerts.js';

// Initialize Environment Variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and Start Server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
    
    // Start Background Jobs
    startThresholdCron();
  })
  .catch((err) => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });