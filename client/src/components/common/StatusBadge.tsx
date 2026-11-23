import type { ApplicationStatus } from '../../types/job';

interface StatusBadgeProps {
  status: ApplicationStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {

  const colors: Record<ApplicationStatus, string> = {
    Applied: 'primary',
    Reviewing: 'warning',
    Shortlisted: 'success',
    Rejected: 'danger'
  };

  return (
    <span className={`badge bg-${colors[status]}`}>
      {status}
    </span>
  );
}

export default StatusBadge;