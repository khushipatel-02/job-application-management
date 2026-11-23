import 'dotenv/config';

import bcrypt from 'bcryptjs';

import { pool } from './config/db';

const createAdmin = async () => {

  try {

    const username = process.env.ADMIN_USERNAME;
    const password = process.env.ADMIN_PASSWORD;

    if (!username || !password) {
      throw new Error('Admin username or password is missing in .env');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `
      INSERT INTO admins (username, password_hash)
      VALUES ($1, $2)
      ON CONFLICT (username) DO NOTHING
      RETURNING admin_id
      `,
      [username, passwordHash]
    );

    if (result.rowCount) {
      console.log('Admin account created successfully.');
    } else {
      console.log('Admin account already exists.');
    }

  } catch (error) {

    console.error('Admin creation failed:', error);
    process.exitCode = 1;

  } finally {

    await pool.end();

  }
};

createAdmin();