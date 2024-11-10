import http from "../http-common";

class UserDataService {
  getAll() {
    return http.get('/auth/users', {
    });
  }
  
  async getOne(pid) {
    const response = await http.get(`/auth/user?id=${pid}`, {});
    return response
  }
  async updateOne(params) {
    const response = await http.put('/auth/user', params);
    return response;
  }
  async addOne(params) {
    const response = await http.post('/auth/user', params);
    return response;
  }
}

export default new UserDataService();