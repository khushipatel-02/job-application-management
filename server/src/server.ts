import 'dotenv/config';

import app from './app';

import { pool } from './config/db';

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {

  try {

    await pool.query('SELECT 1');

    console.log('PostgreSQL connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {

    console.error('Database connection failed:', error);

    process.exit(1);

  }
};

startServer();