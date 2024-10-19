import http from "../http-common";

class RuleNetworkService {
  getAll() {
      return http.get('/rule/rules', {})
  }
}

export default new RuleNetworkService();