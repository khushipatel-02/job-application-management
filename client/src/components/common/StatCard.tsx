interface StatCardProps {
  title: string;
  count: number;
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info';
}

function StatCard({ title, count, color }: StatCardProps) {

  return (
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body">
        <p className="text-secondary mb-2">{title}</p>
        <h3 className={`fw-bold text-${color} mb-0`}>{count}</h3>
      </div>
    </div>
  );
}

export default StatCard;