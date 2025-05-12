import http from '../http-common';
import httpMultipart from '../http-multipart';

class LoginNetworkService {
	login(username, password) {
		return http.post('/auth/login', { username: username, password: password });
	}

	async register(params) {
		return httpMultipart.post('/auth/user', params);
	}

	protected(token) {
		return http.get('/auth/protected', { headers: { Authorization: `Bearer ${token}` } });
	}
}

export default new LoginNetworkService();
