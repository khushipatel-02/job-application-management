export type ApplicationStatus =
  | 'Applied'
  | 'Reviewing'
  | 'Shortlisted'
  | 'Rejected';

export interface JobApplication {
  id: number;
  companyName: string;
  email: string;
  phone: string | null;
  position: string;
  experienceYears: number;
  status: ApplicationStatus;
  appliedDate: string | null;
}

export interface JobApplicationInput {
  companyName: string;
  email: string;
  phone: string;
  position: string;
  experienceYears: number;
  status: ApplicationStatus;
  appliedDate: string;
}