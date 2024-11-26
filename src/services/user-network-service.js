import http from "../http-common";

class UserDataService {
  getAll(token) {
    return http.get('/auth/users', {
      "Authorization": `Bearer ${token}`
    });
  }

  async getOne(pid, token) {
    const response = await http.get(`/auth/user?id=${pid}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response;
  }

  async updateOne(params, token) {
    const response = await http.put('/auth/user', params, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response;
  }

  async addOne(params, token) {
    const response = await http.post('/auth/user', params, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response;
  }
}

export default new UserDataService();