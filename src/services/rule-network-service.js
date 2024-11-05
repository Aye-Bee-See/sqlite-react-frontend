import http from "../http-common";

class RuleNetworkService {
  getAll() {
      return http.get('/rule/rules', {})
  }

  async addOne(params) {
    const response = await http.post('/rule/rule', params);
    console.log(response)
    return response;
    
  }

  async updateOne(params){
    const response = await http.put('/rule/rule', params);
    return response;
  }
  
  async getOne(pid) {
    const response = await http.get(`/rule/rule?id=${pid}`, {});
    return response
  }
}

export default new RuleNetworkService();