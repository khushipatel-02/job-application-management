import api from './api';

import type {
  JobApplication,
  JobApplicationInput
} from '../types/job';

// GET: Fetch applications
export const getJobApplications = async (): Promise<JobApplication[]> => {

  const response = await api.get<JobApplication[]>('/applications');

  return response.data;
};


// POST: Add application
export const createJobApplication = async (
  data: JobApplicationInput
): Promise<JobApplication> => {

  const response = await api.post<JobApplication>(
    '/applications',
    data
  );

  return response.data;
};


// PUT: Edit application
export const updateJobApplication = async (
  id: number,
  data: JobApplicationInput
): Promise<JobApplication> => {

  const response = await api.put<JobApplication>(
    `/applications/${id}`,
    data
  );

  return response.data;
};


// DELETE: Remove application
export const deleteJobApplication = async (
  id: number
): Promise<void> => {

  await api.delete(`/applications/${id}`);

};