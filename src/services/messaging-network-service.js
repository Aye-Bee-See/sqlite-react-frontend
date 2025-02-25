import http from '../http-common';

class MessageNetworkService {
	// Create message
	async addOne(params, token) {
		const response = await http.post('/messaging/message', params, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	}

	// Read all messages by chat
	async getMessagesByChat(chatId, token) {
		return http.get(`/messaging/messages?chat=${chatId}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
	}

	// Read one message
	async getOne(id, token) {
		const response = await http.get(`/messaging/message?id=${id}`, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	}

	// Read messages by user or prisoner
	async getMessagesByUserOrPrisoner(user, prisoner, token) {
		if (user) {
			return http.get(`/messaging/messages?user=${user}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
		} else if (prisoner) {
			return http.get(`/messaging/messages?prisoner=${prisoner}`, {
				headers: { Authorization: `Bearer ${token}` }
			});
		} else {
			console.log('no user or prisoner provided');
		}
	}

	// Update one message
	async updateOne(params, token) {
		const response = await http.put('/messaging/message', params, {
			headers: { Authorization: `Bearer ${token}` }
		});
		return response;
	}

	// Delete one message
	async deleteOne(id, token) {
		const response = await http.delete('/messaging/message', {
			headers: { Authorization: `Bearer ${token}` },
			data: { id }
		});
		return response;
	}
}

export default new MessageNetworkService();
