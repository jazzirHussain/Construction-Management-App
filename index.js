import dotenv from 'dotenv'
if (process.env.NODE_ENV === 'production') {
  dotenv.config({ path: './.env.production' });
} else {
  dotenv.config({ path: './.env.development' });
}

import express from 'express';
import cors from 'cors';
import requestLogger from './config/Logger.js';
import connectDB from './config/Db.js';

import userRoutes from './routes/userRoutes.js'
import authRoutes from './routes/authRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import projectRoutes from './routes/projectRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import timelineRoutes from './routes/timelineRoutes.js'
import activityRoutes from './routes/activityRoutes.js'
import landingRoutes from './routes/landingRoutes.js'
import passport from './config/Passport.js';
import checkAuthenticated from './middlewares/checkAuthenticated.js';
import { adminJs, adminRouter } from './Admin/admin.js';

const app = express();
app.use(express.json({ limit: '10mb' }));

const allowedOrigins = process.env.CLIENT_DOMAIN
app.use(cors({
  // origin: ,
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else {
      // Reject requests from unknown origins
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.set('trust proxy', 1);
connectDB();
app.use(requestLogger);

// Initialize Passport and restore session
app.use(passport.initialize());

app.get('/healthcheck', (req, res) => {
  res.send('The app is working super fine!').status(200);
});

app.use('/api/users', checkAuthenticated, userRoutes);
app.use('/api/payment', checkAuthenticated, paymentRoutes);
app.use('/api/project', checkAuthenticated, projectRoutes);
app.use('/api/gallery', checkAuthenticated, galleryRoutes);
app.use('/api/timeline', checkAuthenticated, timelineRoutes);
app.use('/api/activity', checkAuthenticated, activityRoutes);
app.use('/api/landing', landingRoutes);
app.use('/api/auth', authRoutes);

// admin
app.get('/admin', (req, res) => {
  res.redirect('/admin/resources/Project');
});
app.use(adminJs.options.rootPath, adminRouter);
adminJs.watch()

// analytics
const logMemoryUsage = () => {
  const { rss, heapTotal, heapUsed, external } = process.memoryUsage();
  console.log("usage in kb: ", rss);
  console.log(`Memory Usage: RSS: ${bytesToMB(rss)} MB, Heap Total: ${bytesToMB(heapTotal)} MB, Heap Used: ${bytesToMB(heapUsed)} MB, External: ${bytesToMB(external)} MB`);
};

const bytesToMB = (bytes) => (bytes / (1024 * 1024)).toFixed(2);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port http://localhost:${PORT}`);
  console.log(`Admin running on http://localhost:${PORT}/admin`);
  // logMemoryUsage();
  // setInterval(logMemoryUsage, 10000);
});
