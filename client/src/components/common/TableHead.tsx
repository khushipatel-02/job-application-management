interface TableHeadProps {
  showActions?: boolean;
}

function TableHead({ showActions = false }: TableHeadProps) {
  return (
    <thead className="table-light">
      <tr>
        <th>Company Name</th>
        <th>Position</th>
        <th>Experience</th>
        <th>Status</th>
        <th>Applied Date</th>
        {showActions && <th>Actions</th>}
      </tr>
    </thead>
  );
}

export default TableHead;