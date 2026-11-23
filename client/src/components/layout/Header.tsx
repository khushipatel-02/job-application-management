interface HeaderProps {
  username: string;
}

function Header({ username }: HeaderProps) {

  return (
    <header className="bg-white border-bottom p-3 d-flex justify-content-between align-items-center">

      <h5 className="fw-bold mb-0">Job Application Management</h5>

      <div className="d-flex align-items-center gap-2">

        <i className="bi bi-person-circle fs-5 text-secondary"></i>

        <span className="fw-semibold">
          {username}
        </span>

      </div>

    </header>
  );
}

export default Header;