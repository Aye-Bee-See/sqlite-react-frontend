import http from '../http-common';

class LoginNetworkService {
	login(username, password) {
		return http.post('/auth/login', { username: username, password: password });
	}

	async register(params) {
		return http.post('/auth/user', params);
	}

	protected(token) {
		return http.get('/auth/protected', { headers: { Authorization: `Bearer ${token}` } });
	}
}

export default new LoginNetworkService();
