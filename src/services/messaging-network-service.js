import http from "../http-common";

class MessagingNetworkService {
  // Read All Chats
  async getAll(token) {
    return http.get('/chat/chats', {
      headers: {
      "Authorization": `Bearer ${token}`
      }
    })
}

// Read Chats By User or Prisoner
  async getChatsByUserOrPrisoner(user, prisoner, token) {
    if (user) {
      return http.get(`/chat/chats/?user=${user}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
    } else if (prisoner) {
      return http.get(`/chat/chats/?prisoner=${prisoner}`, {
        headers: {
          "Authorization": `Bearer ${token}` 
        }
      })
    } else { console.log('no user or prisoner provided') }
  }

  async getMessagesByChat(cid, token) {
    return http.get(`/messaging/messages?chat=${cid}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
  }
}

export default new MessagingNetworkService();