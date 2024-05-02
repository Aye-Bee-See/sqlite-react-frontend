import React from 'react'
import { Nav, Navbar, NavItem } from 'reactstrap'
import { Link } from 'react-router-dom'

const NavBar = () => {
  return (
    <Navbar className="navbar-expand navbar-dark bg-dark">
      <Link to={'/'} className="navbar-brand">
        Aye Bee See Admin Dashboard
      </Link>
      <Nav className="navbar-nav mr-auto">
        <NavItem>
          <Link to={'/prisoners'} className="nav-link">
            Prisoners
          </Link>
        </NavItem>
      </Nav>
    </Navbar>
  )
}

export default NavBar;

