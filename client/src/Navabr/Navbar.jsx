import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <div>
      <nav
        className='navbar navbar-dark navbar-expand-lg'
        style={{
          backgroundColor: '#3498db', // Water-themed color for the Navbar background
        }}
      >
        <Link to="/index" className='navbar-brand'>
          Authentication
        </Link>
        <div className='ml-auto'>
          <ul className='navbar-nav'>
            <li className='nav-list'>
              <Link className='nav-link' to='/admin'>
                Admin
              </Link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
