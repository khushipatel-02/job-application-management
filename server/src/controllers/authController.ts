import type { Request, Response } from 'express';

import type { QueryResultRow } from 'pg';

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { pool } from '../config/db';

interface Admin extends QueryResultRow {
  admin_id: number;
  username: string;
  password_hash: string;
}

interface LoginBody {
  username?: string;
  password?: string;
}

export const login = async (
  req: Request<{}, unknown, LoginBody>,
  res: Response
): Promise<void> => {

  try {

    const { username, password } = req.body;

    // Validate input

    if (
      typeof username !== 'string' ||
      !username.trim() ||
      typeof password !== 'string' ||
      !password
    ) {

      res.status(400).json({
        message: 'Username and password are required.'
      });

      return;
    }

    // Find admin in database

    const result = await pool.query<Admin>(
      `
      SELECT admin_id, username, password_hash
      FROM admins
      WHERE username = $1
      `,
      [username.trim()]
    );

    if (result.rows.length === 0) {

      res.status(401).json({
        message: 'Invalid username or password.'
      });

      return;
    }

    const admin = result.rows[0];

    // Compare password with stored hash

    const isPasswordValid = await bcrypt.compare(
      password,
      admin.password_hash
    );

    if (!isPasswordValid) {

      res.status(401).json({
        message: 'Invalid username or password.'
      });

      return;
    }

    // Generate JWT token

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT_SECRET is missing in .env');
    }

    const token = jwt.sign(
      {
        adminId: admin.admin_id,
        username: admin.username
      },
      secret,
      { expiresIn: '1d' }
    );

    // Send successful response

    res.status(200).json({
      message: 'Login successful.',
      token,
      admin: {
        id: admin.admin_id,
        username: admin.username
      }
    });

  } catch (error) {

    console.error('Login error:', error);

    res.status(500).json({
      message: 'Login failed. Please try again.'
    });

  }
};