import { applicationFieldLabels } from '../../types/applicationFields';

interface TableHeadProps {
  showActions?: boolean;
}

function TableHead({ showActions = false }: TableHeadProps) {
  return (
    <thead className="table-light">
      <tr>
        <th>{applicationFieldLabels.companyName}</th>
        <th>{applicationFieldLabels.position}</th>
        <th>{applicationFieldLabels.experienceYears}</th>
        <th>{applicationFieldLabels.status}</th>
        <th>{applicationFieldLabels.appliedDate}</th>
        {showActions && <th>Actions</th>}
      </tr>
    </thead>
  );
}

export default TableHead;