import "./header.module.css";
import logo from '../../../assets/Logo.jpg';

function Header() {
  return (
    <header>
      <img src={logo} height="50" width="50" />
      <nav>
        <ul>
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="/">Github</a>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
