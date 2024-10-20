import http from "../http-common";

class PrisonNetworkService {
  getAll() {
    return http.get('/prison/prisons', {})
}
async getOne(pid) {
  const response = await http.get(`/prison/prison?id=${pid}`, {});
  return response
}

}

export default new PrisonNetworkService();