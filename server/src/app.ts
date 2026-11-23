import express from 'express';

import cors from 'cors';

import authRoutes from './routes/authRoutes';

import jobRoutes from './routes/jobRoutes';

const app = express();

app.use(cors({
  origin: 'http://localhost:5173'
}));

app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    message: 'API is running successfully'
  });
});

// Login API
app.use('/api/auth', authRoutes);

// Job application APIs
app.use('/api/applications', jobRoutes);

export default app;