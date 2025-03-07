import http from '../http-common';

class PrisonerDataService {
	getAll(token) {
		return http.get('/prisoner/prisoners', { headers: { Authorization: `Bearer ${token}` } });
	}

	async getByPrison(pid, token) {
		return http.get(`/prisoner/prisoners?prison=${pid}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
	}

	async getOne(pid, token) {
		const response = await http.get(`/prisoner/prisoner?id=${pid}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	}

	async updateOne(params, token) {
		const response = await http.put('/prisoner/prisoner', params, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	}

	async addOne(params, token) {
		const response = await http.post('/prisoner/prisoner', params, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	}
	async deleteOne(id, token) {
		const response = await http.delete('/prisoner/prisoner', {
			headers: { Authorization: `Bearer ${token}` },
			data: { id }
		});
		return response;
	}
}

export default new PrisonerDataService();
