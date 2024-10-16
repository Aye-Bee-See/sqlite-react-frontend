import http from "../http-common";

class PrisonNetworkService {
  getAll() {
    return http.get('/prison/prisons', {

  })
}

}

export default new PrisonNetworkService();