import React from 'react';
import { Navigate } from 'react-router-dom';

// TODO: When call fails unauthorized, redirect to login

const ProtectedRoute = ({ element: Component, ...rest }) => {
	const isAuthenticated = () => {
		const token = JSON.parse(localStorage.getItem('token'));
		if (!token) {
			return false;
		}

		const expiration = new Date(token.expiration);
		const now = new Date();

		if (now > expiration) {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			return false;
		}

		return true;
	};

	return isAuthenticated() ? Component : <Navigate to="/login" />;
};

export default ProtectedRoute;
