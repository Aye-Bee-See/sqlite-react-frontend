import http from "../http-common";

class PrisonerDataService {
  getAll() {
    return http.get('/prisoner/prisoners', {
     params: {
      prison: 'true'
     } 
    })
  }
}

export default new PrisonerDataService();