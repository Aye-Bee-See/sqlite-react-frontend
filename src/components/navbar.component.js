import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'reactstrap';

const NavBar = ({ token }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(token !== null);
  }, [token]);

  return (
    <Navbar color="light" light expand="md">
      <Link to="/" className="navbar-brand">Aye Bee See</Link>
      <Nav className="ml-auto" navbar>
        {isAuthenticated ? (
          <>
            <NavItem>
              <Link to="/prisoners" className="nav-link">Prisoners</Link>
            </NavItem>
            <NavItem>
              <Link to="/users" className="nav-link">Users</Link>
            </NavItem>
            <NavItem>
              <Link to="/prisons" className="nav-link">Prisons</Link>
            </NavItem>
            <NavItem>
              <Link to="/messaging" className="nav-link">Messaging</Link>
            </NavItem>
            <NavItem>
              <Link to="/rules" className="nav-link">Rules</Link>
            </NavItem>
          </>
        ) : (
          <NavItem>
            <Link to="/login" className="nav-link">Login</Link>
          </NavItem>
        )}
      </Nav>
    </Navbar>
  );
};

export default NavBar;

