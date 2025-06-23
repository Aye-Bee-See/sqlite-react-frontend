import http from '../http-common';
import httpMultipart from '../http-multipart';

class UserDataService {
	getAll(token, page_size = 10, page = 1) {
		return http.get(`/auth/users?page_size=${page_size}&page=${page}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
	}

	async getOne(pid, token) {
		const response = await http.get(`/auth/user?id=${pid}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	}

	async updateOne(params, token) {
		const response = await http.put('/auth/user', params, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	}

	async addOne(params, token) {
		let response;

		response = await httpMultipart.post('/auth/user', params, {
			headers: { Authorization: `Bearer ${token}` }
		});

		return response;
	}

	async deleteOne(id, token) {
		const response = await http.delete('/auth/user', {
			headers: { Authorization: `Bearer ${token}` },
			data: { id }
		});
		return response;
	}
}

export default new UserDataService();
