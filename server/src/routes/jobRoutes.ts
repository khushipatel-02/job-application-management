import { Router } from 'express';

import {
  getJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication
} from '../controllers/jobController';

import { authenticateToken } from '../middleware/authMiddleware';

const router = Router();

router.get('/', authenticateToken, getJobApplications);

router.post('/', authenticateToken, createJobApplication);

router.put('/:id', authenticateToken, updateJobApplication);

router.delete('/:id', authenticateToken, deleteJobApplication);

export default router;