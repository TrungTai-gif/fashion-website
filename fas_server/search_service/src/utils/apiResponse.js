class ApiResponse {
  constructor({
    success = true,
    status = 200,
    message = null,
    data = null,
  } = {}) {
    this.success = success;
    this.status = status;
    this.message = message;
    this.data = data;
  }
}

export default ApiResponse;
