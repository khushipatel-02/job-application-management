import { useState } from 'react';

import { Outlet, useNavigate } from 'react-router-dom';

import Sidebar from './Sidebar';
import Header from './Header';

import ConfirmModal from '../common/ConfirmModal';

function MainLayout() {

  const navigate = useNavigate();

  const [showLogout, setShowLogout] = useState(false);

  // Get logged-in admin details
  const adminData = localStorage.getItem('admin');

  let username = 'Admin';

  if (adminData) {
    try {
      username = JSON.parse(adminData).username || 'Admin';
    } catch {
      username = 'Admin';
    }
  }

  // Confirm logout
  const handleLogout = () => {

    localStorage.removeItem('token');
    localStorage.removeItem('admin');

    setShowLogout(false);

    navigate('/login', { replace: true });

  };

  return (
    <div className="container-fluid px-0">

      <div className="row min-vh-100 g-0">

        {/* Sidebar */}

        <div className="col-lg-2 bg-dark">
          <Sidebar
            onLogout={() => setShowLogout(true)}
          />
        </div>

        {/* Main Content */}

        <main className="col-lg-10 bg-light">

          <Header username={username} />

          <div className="p-3 p-md-4">
            <Outlet />
          </div>

        </main>

      </div>

      {/* Logout Modal */}

      <ConfirmModal
        show={showLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogout(false)}
      />

    </div>
  );
}

export default MainLayout;