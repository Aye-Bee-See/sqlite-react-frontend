import http from "../http-common";

class ChapterNetworkService {
  // Create chapter
  async addOne(params, token) {
    const response = await http.post('/chapter/chapter', params, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response;
  }

  // Read all chapters
  async getAll(token) {
    return http.get('/chapter/chapters', {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  }

  // Read one chapter
  async getOne(id, token) {
    return http.get(`/chapter/chapters?id=${id}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  }

  // Update one chapter
  async updateOne(params, token) {
    const response = await http.put('/chapter/chapter', params, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response;
  }

  // Delete one chapter
  async deleteOne(id, token) {
    const response = await http.delete('/chapter/chapter', {
      headers: {
        "Authorization": `Bearer ${token}`
      },
      data: { id }
    });
    return response;
  }
}

export default new ChapterNetworkService();
