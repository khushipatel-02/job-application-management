import { useEffect, useState } from 'react';

import StatCard from '../components/common/StatCard';
import JobTable from '../components/jobs/JobTable';

import { getJobApplications } from '../services/jobService';

import type { JobApplication } from '../types/job';

function Dashboard() {

  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch job applications
  useEffect(() => {

    const fetchApplications = async () => {

      try {

        const data = await getJobApplications();

        setApplications(data);

      } catch (error) {

        console.error(error);
        setError('Failed to load job applications.');

      } finally {

        setLoading(false);

      }
    };

    fetchApplications();

  }, []);

  // Calculate application counts
  const totalApplications = applications.length;

  const appliedCount = applications.filter(
    (application) => application.status === 'Applied'
  ).length;

  const reviewingCount = applications.filter(
    (application) => application.status === 'Reviewing'
  ).length;

  const shortlistedCount = applications.filter(
    (application) => application.status === 'Shortlisted'
  ).length;

  const rejectedCount = applications.filter(
    (application) => application.status === 'Rejected'
  ).length;

  // Dashboard statistics
  const stats = [
    {
      title: 'Total Applications',
      count: totalApplications,
      color: 'info'
    },
    {
      title: 'Applied',
      count: appliedCount,
      color: 'primary'
    },
    {
      title: 'Reviewing',
      count: reviewingCount,
      color: 'warning'
    },
    {
      title: 'Shortlisted',
      count: shortlistedCount,
      color: 'success'
    },
    {
      title: 'Rejected',
      count: rejectedCount,
      color: 'danger'
    }
  ] as const;

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary"></div>
        <p className="text-secondary mt-2">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
      </div>
    );
  }

  return (
    <div>

      {/* Dashboard Heading */}

      <div className="mb-4">
        <h4 className="fw-bold mb-1">Dashboard</h4>
        <p className="text-secondary mb-0">
          Overview of job applications.
        </p>
      </div>

      {/* Statistics Cards */}

      <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-5 g-3 mb-4">

        {stats.map((stat) => (
          <div className="col" key={stat.title}>
            <StatCard
              title={stat.title}
              count={stat.count}
              color={stat.color}
            />
          </div>
        ))}

      </div>

      {/* Recent Applications */}

      <JobTable
        title="Recently Applied"
        applications={applications}
        limit={10}
      />

    </div>
  );
}

export default Dashboard;