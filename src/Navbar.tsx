import { Link } from 'react-router-dom'
const Navbar: React.FC = () => {
  return (
    <>
      <nav className='navbar'>
        <ul className='navlist'>
          <img className='logo' src='gojo.svg' alt='Satoru Gojo'></img>
          <li className='navlist-item'></li>
          <li className='navlist-item'><Link to='/'>Home</Link></li>
          <li className='navlist-item'><Link to='projects'>Projects</Link></li>
          <li className='navlist-item'><Link to='search'>Search</Link></li>
        </ul>
      </nav>
    </>
  );
};
export default Navbar;
