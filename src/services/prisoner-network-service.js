import http from '../http-common';
import httpMultipart from '../http-multipart';

class PrisonerDataService {
	getAll(token, page_size = 10, page = 1) {
		return http.get(`/prisoner/prisoners?page_size=${page_size}&page=${page}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
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
		const response = await httpMultipart.put('/prisoner/prisoner', params, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	}

	async addOne(params, token) {
		const response = await httpMultipart.post('/prisoner/prisoner', params, {
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
