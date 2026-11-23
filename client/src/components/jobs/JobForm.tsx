import { useState } from 'react';
import type { FormEvent } from 'react';
import axios from 'axios';

import type {
  ApplicationStatus,
  JobApplication,
  JobApplicationInput,
} from '../../types/job';

import { getTodayDate } from '../../utils/formatDate';

interface JobFormProps {
  application?: JobApplication | null;
  onSubmit: (data: JobApplicationInput) => Promise<void>;
  onCancel: () => void;
}

function JobForm({
  application,
  onSubmit,
  onCancel,
}: JobFormProps) {
  const [formData, setFormData] = useState<JobApplicationInput>({
    companyName: application?.companyName ?? '',
    email: application?.email ?? '',
    phone: application?.phone ?? '',
    position: application?.position ?? '',
    experienceYears: application?.experienceYears ?? 0,
    status: application?.status ?? 'Applied',
    appliedDate: application?.appliedDate?.split('T')[0] ?? getTodayDate(),
  });

  const [error, setError] = useState('');

  const updateField = <K extends keyof JobApplicationInput,>(
    field: K,
    value: JobApplicationInput[K]
  ) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');

    try {
      await onSubmit(formData);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Something went wrong.');
      } else {
        setError('Unable to save application.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="alert alert-danger">
          {error}
        </div>
      )}

      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            className="form-control"
            value={formData.companyName}
            onChange={(e) => updateField('companyName', e.target.value)}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Company Email</label>
          <input
            type="email"
            className="form-control"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="Enter company email"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone Number</label>
          <input
            type="tel"
            className="form-control"
            value={formData.phone}
            onChange={(e) => updateField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
            maxLength={10}
            placeholder="Enter phone number"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Position</label>
          <input
            type="text"
            className="form-control"
            value={formData.position}
            onChange={(e) => updateField('position', e.target.value)}
            placeholder="Enter job position"
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Experience (Years)</label>
          <input
            type="number"
            className="form-control"
            min="0"
            step="1"
            value={formData.experienceYears}
            onChange={(e) =>
              updateField('experienceYears', Number(e.target.value))
            }
            required
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) =>
              updateField('status', e.target.value as ApplicationStatus)
            }
          >
            <option value="Applied">Applied</option>
            <option value="Reviewing">Reviewing</option>
            <option value="Shortlisted">Shortlisted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="col-md-6">
          <label className="form-label">Applied Date</label>
          <input
            type="date"
            className="form-control"
            value={formData.appliedDate}
            onChange={(e) => updateField('appliedDate', e.target.value)}
            required
          />
        </div>
      </div>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>

        <button type="submit" className="btn btn-primary">
          {application ? 'Update Application' : 'Save Application'}
        </button>
      </div>
    </form>
  );
}

export default JobForm;