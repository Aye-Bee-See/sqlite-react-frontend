import http from '../http-common';

class PrisonNetworkService {
	getAll(token, page_size = 10, page = 1) {
		return http.get(`/prison/prisons?page_size=${page_size}&page=${page}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
	}

	async addOne(params, token) {
		const response = await http.post('/prison/prison', params, {
			headers: { Authorization: `Bearer ${token}` }
		});
		console.log(response);
		return response;
	}

	async updateOne(params, token) {
		const response = await http.put('/prison/prison', params, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	}

	async getOne(pid, token) {
		const response = await http.get(`/prison/prison?id=${pid}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	}

	async deleteOne(id, token) {
		const response = await http.delete('/prison/prison', {
			headers: { Authorization: `Bearer ${token}` },
			data: { id }
		});
		return response;
	}
}

export default new PrisonNetworkService();
