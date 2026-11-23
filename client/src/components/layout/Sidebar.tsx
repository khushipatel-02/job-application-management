import { NavLink } from 'react-router-dom';

interface SidebarProps {
  onLogout: () => void;
}

function Sidebar({ onLogout }: SidebarProps) {

  const menuItems = [
    {
      title: 'Dashboard',
      path: '/dashboard',
      icon: 'bi-speedometer2'
    },
    {
      title: 'Job Applications',
      path: '/applications',
      icon: 'bi-briefcase'
    }
  ];

  return (
    <aside className="bg-dark text-white p-3 h-100">

      <h4 className="fw-bold mb-4">
        Job Manager
      </h4>

      <nav className="nav flex-column gap-2">

        {menuItems.map((item) => (

          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-link text-white rounded ${
                isActive ? 'bg-primary' : ''
              }`
            }
          >
            <i className={`bi ${item.icon} me-2`}></i>
            {item.title}
          </NavLink>

        ))}

        <button
          type="button"
          className="nav-link text-white text-start rounded"
          onClick={onLogout}
        >
          <i className="bi bi-box-arrow-right me-2"></i>
          Logout
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;