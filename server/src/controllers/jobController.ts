import { Request, Response } from 'express';
import { pool } from '../config/db';
import {
  ApplicationStatus,
  JobApplicationInput,
} from '../types/job';

const applicationFields = `
  application_id AS id,
  company_name AS "companyName",
  email,
  phone,
  position,
  experience_years AS "experienceYears",
  status,
  applied_date AS "appliedDate"
`;

const validStatuses: ApplicationStatus[] = [
  'Applied',
  'Reviewing',
  'Shortlisted',
  'Rejected',
];

function validateApplication(body: Partial<JobApplicationInput>) {
  const { companyName, email, phone, position, status, appliedDate } = body;
  const experienceYears = Number(body.experienceYears ?? 0);

  if (typeof companyName !== 'string' || !companyName.trim()) {
    return { error: 'Company name is required.' };
  }

  if (
    typeof email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return { error: 'Please enter a valid email address.' };
  }

  if (typeof position !== 'string' || !position.trim()) {
    return { error: 'Position is required.' };
  }

  if (!Number.isInteger(experienceYears) || experienceYears < 0) {
    return { error: 'Experience must be a valid non-negative number.' };
  }

  const applicationStatus = status ?? 'Applied';

  if (!validStatuses.includes(applicationStatus)) {
    return { error: 'Invalid application status.' };
  }

  if (
    typeof appliedDate !== 'string' ||
    !/^\d{4}-\d{2}-\d{2}$/.test(appliedDate)
  ) {
    return { error: 'Please select a valid applied date.' };
  }

  const parsedDate = new Date(`${appliedDate}T00:00:00.000Z`);

  if (
    Number.isNaN(parsedDate.getTime()) ||
    parsedDate.toISOString().slice(0, 10) !== appliedDate
  ) {
    return { error: 'Please select a valid applied date.' };
  }

  return {
    data: {
      companyName: companyName.trim(),
      email: email.trim(),
      phone: typeof phone === 'string' ? phone.trim() : '',
      position: position.trim(),
      experienceYears,
      status: applicationStatus,
      appliedDate,
    } satisfies JobApplicationInput,
  };
}

// Get all applications
export const getJobApplications = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await pool.query(`
      SELECT ${applicationFields}
      FROM job_applications
      ORDER BY applied_date DESC, application_id DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Unable to fetch applications.' });
  }
};

// Create application
export const createJobApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validation = validateApplication(req.body);

    if ('error' in validation) {
      res.status(400).json({ message: validation.error });
      return;
    }

    const {
      companyName,
      email,
      phone,
      position,
      experienceYears,
      status,
      appliedDate,
    } = validation.data;

    const result = await pool.query(
      `
        INSERT INTO job_applications (
          company_name,
          email,
          phone,
          position,
          experience_years,
          status,
          applied_date
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING ${applicationFields}
      `,
      [
        companyName,
        email,
        phone || null,
        position,
        experienceYears,
        status,
        appliedDate,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create application error:', error);
    res.status(500).json({ message: 'Unable to create application.' });
  }
};

// Update application
export const updateJobApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: 'Invalid application ID.' });
      return;
    }

    const validation = validateApplication(req.body);

    if ('error' in validation) {
      res.status(400).json({ message: validation.error });
      return;
    }

    const {
      companyName,
      email,
      phone,
      position,
      experienceYears,
      status,
      appliedDate,
    } = validation.data;

    const result = await pool.query(
      `
        UPDATE job_applications
        SET
          company_name = $1,
          email = $2,
          phone = $3,
          position = $4,
          experience_years = $5,
          status = $6,
          applied_date = $7,
          updated_at = CURRENT_TIMESTAMP
        WHERE application_id = $8
        RETURNING ${applicationFields}
      `,
      [
        companyName,
        email,
        phone || null,
        position,
        experienceYears,
        status,
        appliedDate,
        id,
      ]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Application not found.' });
      return;
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Unable to update application.' });
  }
};

// Delete application
export const deleteJobApplication = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      res.status(400).json({ message: 'Invalid application ID.' });
      return;
    }

    const result = await pool.query(
      `
        DELETE FROM job_applications
        WHERE application_id = $1
        RETURNING application_id
      `,
      [id]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ message: 'Application not found.' });
      return;
    }

    res.json({ message: 'Application deleted successfully.' });
  } catch (error) {
    console.error('Delete application error:', error);
    res.status(500).json({ message: 'Unable to delete application.' });
  }
};