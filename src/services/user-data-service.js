import http from "../http-common";

class UserDataService {
  getAll() {
    return http.get('/auth/users', {
    });
  }

  getOne(id) {
    return http.get('/auth/user', {
      params: { id: id }
    })
  }

  async addOne(params) {
    const response = await http.post('/auth/user', params);
    console.log(response)

    return response;
  }
}

export default new UserDataService();