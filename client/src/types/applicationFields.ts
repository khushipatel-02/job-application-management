import type { JobApplicationInput } from '../types/job';

export const applicationFieldLabels: Record<
  keyof JobApplicationInput, string
> = {
  companyName: 'Company Name',
  email: 'Company Email',
  phone: 'Phone Number',
  position: 'Position',
  experienceYears: 'Experience (Years)',
  status: 'Status',
  appliedDate: 'Applied Date',
};