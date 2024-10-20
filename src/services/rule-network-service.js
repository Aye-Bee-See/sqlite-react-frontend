import http from "../http-common";

class RuleNetworkService {
  getAll() {
      return http.get('/rule/rules', {})
  }
  async getOne(pid) {
    const response = await http.get(`/rule/rule?id=${pid}`, {});
    return response
  }
}

export default new RuleNetworkService();