import http from "../http-common";

class PrisonerDataService {
  getAll() {
    return http.get('/prisoner/prisoners', {
    });
  }

  async getOne(pid) {
    const response = await http.get(`/prisoner/prisoner/${pid}`, {});
    return response
  }

  async addOne(params) {
    const response = await http.post('/prisoner/prisoner', params);
    console.log(response)
    return response;
    
  }
}

export default new PrisonerDataService();