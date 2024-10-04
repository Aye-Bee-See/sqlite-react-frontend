import http from "../http-common";

class PrisonerDataService {
  getAll() {
    return http.get('/prisoner/prisoners', {
    });
  }

  getOne(id) {
    return http.get('/prisoner/prisoner/', {
      params: { id }
    });
  }

  async addOne(params) {

    const response = await http.post('/prisoner/prisoner', params);

    console.log(response)

    return response;
    
  }
}

export default new PrisonerDataService();