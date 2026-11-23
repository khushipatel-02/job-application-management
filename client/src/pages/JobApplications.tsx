import { useEffect, useState } from 'react';
import axios from 'axios';

import JobTable from '../components/jobs/JobTable';
import JobForm from '../components/jobs/JobForm';
import ConfirmModal from '../components/common/ConfirmModal';

import type {
  JobApplication,
  JobApplicationInput,
} from '../types/job';

import {
  getJobApplications,
  createJobApplication,
  updateJobApplication,
  deleteJobApplication,
} from '../services/jobService';

import { formatDate } from '../utils/formatDate';

function JobApplications() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingApplication, setEditingApplication] =
    useState<JobApplication | null>(null);

  const [viewingApplication, setViewingApplication] =
    useState<JobApplication | null>(null);

  const [deletingApplication, setDeletingApplication] =
    useState<JobApplication | null>(null);
  
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getJobApplications();
        setApplications(data);
      } catch {
        setError('Unable to load applications.');
      } finally {
        setLoading(false);
      }
    };

    void fetchApplications();
  }, []);

  const handleAdd = () => {
    setEditingApplication(null);
    setSuccessMessage('');
    setShowForm(true);
  };

  const handleEdit = (application: JobApplication) => {
    setEditingApplication(application);
    setSuccessMessage('');
    setShowForm(true);
  };

  const handleSave = async (data: JobApplicationInput) => {
    setSuccessMessage('');

    if (editingApplication) {
      // Update application
      const updated = await updateJobApplication(editingApplication.id, data);

      setApplications((current) =>
        current.map((application) =>
          application.id === updated.id ? updated : application
        )
      );

      setSuccessMessage('Application updated successfully.');
    } else {
      // Add application
      const created = await createJobApplication(data);

      setApplications((current) => [created, ...current]);

      setSuccessMessage('Application added successfully.');
    }

    setShowForm(false);
    setEditingApplication(null);

    setTimeout(() => {
      setSuccessMessage('');
    }, 2000);
  };

  const handleDelete = async () => {
    if (!deletingApplication) return;

    try {
      await deleteJobApplication(deletingApplication.id);

      setApplications((current) =>
        current.filter(
          (application) => application.id !== deletingApplication.id
        )
      );

      setDeletingApplication(null);
    } catch (error) {
      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || 'Unable to delete application.'
          : 'Unable to delete application.'
      );
    }
  };

  const filteredApplications = applications.filter((application) => {
    const searchValue = `
      ${application.companyName}
      ${application.position}
      ${application.status}
    `.toLowerCase();

    return searchValue.includes(searchTerm.toLowerCase());
  });

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status" />
      </div>
    );
  }


  return (
    <div className="container-fluid">
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h3 className="mb-1">Job Applications</h3>
          <p className="text-muted mb-0">
            Manage all company applications.
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleAdd}>
          <i className="bi bi-plus-lg me-2" />
          Add Application
        </button>
      </div>

      {error && (
        <div className="alert alert-danger alert-dismissible">
          {error}
          <button
            type="button"
            className="btn-close"
            onClick={() => setError('')}
          />
        </div>
      )}

      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body">
          <div className="row">
            <div className="col-12">
              <div className="input-group">
                <span className="input-group-text bg-white">
                  <i className="bi bi-search" />
                </span>

                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by company name, position or status"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle me-2" />
          {successMessage}
        </div>
      )}

      <JobTable
        totalCount={applications.length}
        applications={filteredApplications}
        onView={setViewingApplication}
        onEdit={handleEdit}
        onDelete={setDeletingApplication}
      />

      {/* Add / Edit Modal */}
      {showForm && (
        <>
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingApplication
                      ? 'Edit Application'
                      : 'Add Application'}
                  </h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowForm(false)}
                  />
                </div>

                <div className="modal-body">
                  <JobForm
                    key={editingApplication?.id ?? 'new'}
                    application={editingApplication}
                    onSubmit={handleSave}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" />
        </>
      )}

      {/* View Modal */}
      {viewingApplication && (
        <>
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-lg modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Application Details</h5>

                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setViewingApplication(null)}
                  />
                </div>

                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <strong>Company Name</strong>
                      <p>{viewingApplication.companyName}</p>
                    </div>

                    <div className="col-md-6">
                      <strong>Company Email</strong>
                      <p>{viewingApplication.email}</p>
                    </div>

                    <div className="col-md-6">
                      <strong>Phone Number</strong>
                      <p>{viewingApplication.phone || '-'}</p>
                    </div>

                    <div className="col-md-6">
                      <strong>Position</strong>
                      <p>{viewingApplication.position}</p>
                    </div>

                    <div className="col-md-6">
                      <strong>Experience</strong>
                      <p>{viewingApplication.experienceYears} Years</p>
                    </div>

                    <div className="col-md-6">
                      <strong>Status</strong>
                      <p>{viewingApplication.status}</p>
                    </div>

                    <div className="col-md-6">
                      <strong>Applied Date</strong>
                      <p>{formatDate(viewingApplication.appliedDate)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-backdrop fade show" />
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        show={Boolean(deletingApplication)}
        title="Delete Application"
        message="Are you sure you want to delete this application?"
        onConfirm={handleDelete}
        onCancel={() => setDeletingApplication(null)}
      />
    </div>
  );
}

export default JobApplications;