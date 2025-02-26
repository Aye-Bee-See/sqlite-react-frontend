import http from '../http-common';

class ChatNetworkService {
	// Create chat
	async addOne(params, token) {
		const response = await http.post('/chat/chat', params, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response;
	}

	// Read all chats
	async getAll(token) {
		return http.get('/chat/chats', {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	}

	// Read one chat
	async getOne(id, token) {
		return http.get(`/chat/chat?id=${id}`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
	}

	// Update one chat
	async updateOne(params, token) {
		const response = await http.put('/chat/chat', params, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		});
		return response;
	}

	// Delete one chat
	async deleteOne(id, token) {
		const response = await http.delete('/chat/chat', {
			headers: {
				Authorization: `Bearer ${token}`
			},
			data: { id }
		});
		return response;
	}

	// Read chats by user or prisoner
	async getChatsByUserOrPrisoner(user, prisoner, token) {
		if (user) {
			return http.get(`/chat/chats/?user=${user}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
		} else if (prisoner) {
			return http.get(`/chat/chats/?prisoner=${prisoner}`, {
				headers: {
					Authorization: `Bearer ${token}`
				}
			});
		} else {
			console.log('no user or prisoner provided');
		}
	}
}

export default new ChatNetworkService();
