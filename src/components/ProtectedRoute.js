import React from 'react';
import { Navigate } from 'react-router-dom';

// TODO: When call fails unauthorized, redirect to login

export const isAuthenticated = () => {
	const token = JSON.parse(localStorage.getItem('token'));
	if (!token) {
		return false;
	}
	const expiry = token.expires || 0;
	const currentTime = Date.now();
	if (currentTime > expiry) {
		localStorage.removeItem('token');
		localStorage.removeItem('user');
		return false;
	}

	const expiration = new Date(token.expiration);
	const now = new Date();

	return true;
};

const ProtectedRoute = ({ element: Component, ...rest }) => {
	return isAuthenticated() ? Component : <Navigate to="/login" />;
};

export default ProtectedRoute;
