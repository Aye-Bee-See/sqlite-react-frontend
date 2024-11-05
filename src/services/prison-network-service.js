import http from "../http-common";

class PrisonNetworkService {
  getAll() {
    return http.get('/prison/prisons', {})
}

async addOne(params) {
  const response = await http.post('/prison/prison', params);
  console.log(response)
  return response;
  
}

async updateOne(params){
  const response = await http.put('/prison/prison', params);
  return response;
}

async getOne(pid) {
  const response = await http.get(`/prison/prison?id=${pid}`, {});
  return response
}

}

export default new PrisonNetworkService();