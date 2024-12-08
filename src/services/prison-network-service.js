import http from "../http-common";

class PrisonNetworkService {
  getAll(token) {
    return http.get('/prison/prisons', {
      headers: {
      "Authorization": `Bearer ${token}`
      }
    })
}

async addOne(params, token) {
  const response = await http.post('/prison/prison', params, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  console.log(response);
  return response;
}

async updateOne(params, token) {
  const response = await http.put('/prison/prison', params, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return response;
}

async getOne(pid, token) {
  const response = await http.get(`/prison/prison?id=${pid}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
  return response;
}

}

export default new PrisonNetworkService();