import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavItem, Button } from 'reactstrap';

const NavBar = ({ token, logOut }) => {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setIsAuthenticated(token !== null);
	}, [token]);

	const handleLogOut = () => {
		logOut();
		navigate('/');
	};

	return (
		<Navbar color="light" light expand="md">
			<Link to="/" className="navbar-brand">
				Aye Bee See
			</Link>
			<Nav className="ml-auto" navbar>
				{isAuthenticated ? (
					<>
						<NavItem>
							<Link to="/prisoners" className="nav-link">
								Prisoners
							</Link>
						</NavItem>
						<NavItem>
							<Link to="/users" className="nav-link">
								Users
							</Link>
						</NavItem>
						<NavItem>
							<Link to="/prisons" className="nav-link">
								Prisons
							</Link>
						</NavItem>
						<NavItem>
							<Link to="/messaging" className="nav-link">
								Messaging
							</Link>
						</NavItem>
						<NavItem>
							<Link to="/rules" className="nav-link">
								Rules
							</Link>
						</NavItem>
						<NavItem>
							<Link to="/chapters" className="nav-link">
								Chapters
							</Link>
						</NavItem>
						<NavItem>
							<Link to="/tests" className="nav-link">
								Tests
							</Link>
						</NavItem>

						<NavItem>
							<Button onClick={handleLogOut} className="nav-link">
								Log Out
							</Button>
						</NavItem>
					</>
				) : (
					<NavItem>
						<Link to="/login" className="nav-link">
							Login
						</Link>
					</NavItem>
				)}
			</Nav>
		</Navbar>
	);
};

export default NavBar;
