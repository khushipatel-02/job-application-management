import type { JobApplication } from '../../types/job';

import StatusBadge from '../common/StatusBadge';
import TableHead from '../common/TableHead';
import { formatDate } from '../../utils/formatDate';

interface JobTableProps {
  applications: JobApplication[];
  title?: string;
  limit?: number;
  totalCount?: number;
  onView?: (application: JobApplication) => void;
  onEdit?: (application: JobApplication) => void;
  onDelete?: (application: JobApplication) => void;
}

function JobTable({
  applications,
  title,
  limit,
  totalCount,
  onView,
  onEdit,
  onDelete,
}: JobTableProps) {
  const displayedApplications = limit
    ? applications.slice(0, limit)
    : applications;

  const showActions = Boolean(onView || onEdit || onDelete);

  return (
    <div className="card border-0 shadow-sm">
      {(title || totalCount !== undefined) && (
        <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
          {title && <h5 className="mb-0 badge text-bg-primary fs-6">{title}</h5>}

          {totalCount !== undefined && (
            <span className="badge text-bg-primary fs-6">
              Total Applications: {totalCount}
            </span>
          )}
        </div>
      )}

      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <TableHead showActions={showActions} />

            <tbody>
              {displayedApplications.length > 0 ? (
                displayedApplications.map((application) => (
                  <tr key={application.id}>
                    <td className="fw-medium">{application.companyName}</td>
                    <td>{application.position}</td>
                    <td>{application.experienceYears} Years</td>
                    <td>
                      <StatusBadge status={application.status} />
                    </td>
                    <td>{formatDate(application.appliedDate)}</td>

                    {showActions && (
                      <td>
                        <div className="d-flex gap-2">
                          {onView && (
                            <button
                              className="btn btn-sm btn-outline-info"
                              onClick={() => onView(application)}
                              title="View"
                            >
                              <i className="bi bi-eye" />
                            </button>
                          )}

                          {onEdit && (
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => onEdit(application)}
                              title="Edit"
                            >
                              <i className="bi bi-pencil" />
                            </button>
                          )}

                          {onDelete && (
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => onDelete(application)}
                              title="Delete"
                            >
                              <i className="bi bi-trash" />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={showActions ? 7 : 6}
                    className="text-center py-4 text-muted"
                  >
                    No applications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default JobTable;