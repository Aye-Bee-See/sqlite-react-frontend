import http from "../http-common";

class LoginNetworkService {
  login(username, password) {
    console.log(`Username: ${username}, Password: ${password}`);
    return http.post('/auth/login', {
      'username': username,
      'password': password
    })
  }

  protected(token) {
    return http.get('/auth/protected', {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
  }
}

export default new LoginNetworkService();