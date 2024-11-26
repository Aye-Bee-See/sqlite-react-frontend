import http from "../http-common";

class RuleNetworkService {
  getAll(token) {
      return http.get('/rule/rules', {
        "Authorization": `Bearer ${token}`
      })
  }
  async addOne(params, token) {
    const response = await http.post('/rule/rule', params, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    console.log(response)
    return response;
  }

  async updateOne(params, token) {
    const response = await http.put('/rule/rule', params, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response;
  }
  
  async getOne(pid, token) {
    const response = await http.get(`/rule/rule?id=${pid}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response;
  }
}

export default new RuleNetworkService();