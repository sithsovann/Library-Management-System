import { Link, useLocation } from 'react-router-dom';

function Sidebar({ user, onLogout }) {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <i className="fa-solid fa-book-open sidebar-logo-mark"></i>
        <div>
          <div className="sidebar-logo-title">Library System</div>
          <div className="sidebar-logo-subtitle">Management Suite</div>
        </div>
      </div>
     
      <div className="sidebar-section-label">Operations</div>
      <nav className="sidebar-nav">
      <Link to="/" className={isActive('/') ? 'active' : ''}>
         <i className="fa-regular fa-book-open"></i> Books (Catalog)
        </Link>
      <Link to="/borrowers" className={isActive('/borrowers') ? 'active' : ''}>
        <i className="fa-solid fa-user"></i> Borrowers
      </Link>
      <Link to="/loans" className={isActive('/loans') ? 'active' : ''}>
        <i className="fa-solid fa-lines-leaning"></i> Loans &amp; Checkouts
      </Link>
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="sidebar-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div className="sidebar-user-name">{user?.name}</div>
            <div className="sidebar-user-role">Librarian</div>
          </div>
        </div>
        <button className="sidebar-logout" onClick={onLogout}>
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;