const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const config = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email, password) {
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(userData) {
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async getProfile() {
    return this.request("/auth/profile");
  }

  async updateProfile(profileData) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  // Jobs endpoints
  async getJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/jobs${queryString ? `?${queryString}` : ""}`);
  }

  async getJobById(id) {
    return this.request(`/jobs/${id}`);
  }

  async createJob(jobData) {
    return this.request("/jobs", {
      method: "POST",
      body: JSON.stringify(jobData),
    });
  }

  async getMyJobs(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/jobs/my/jobs${queryString ? `?${queryString}` : ""}`);
  }

  async updateJob(id, jobData) {
    return this.request(`/jobs/${id}`, {
      method: "PUT",
      body: JSON.stringify(jobData),
    });
  }

  async deleteJob(id) {
    return this.request(`/jobs/${id}`, {
      method: "DELETE",
    });
  }

  // Applications endpoints
  async applyToJob(applicationData) {
    return this.request("/applications/apply", {
      method: "POST",
      body: JSON.stringify(applicationData),
    });
  }

  async getMyApplications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const res=await this.request(
      `/applications/my${queryString ? `?${queryString}` : ""}`
    );
    return res?.data || res;
  }

  async getJobApplications(jobId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(
      `/applications/job/${jobId}${queryString ? `?${queryString}` : ""}`
    );
  }

  async updateApplicationStatus(applicationId, status, notes = "") {
    return this.request(`/applications/${applicationId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, notes }),
    });
  }

  async getApplicationById(id) {
    return this.request(`/applications/${id}`);
  }

  // Resume endpoints
  async uploadResume(formData) {
    const token = localStorage.getItem("token");
    return fetch(`${this.baseURL}/resume/upload`, {
      method: "POST",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Resume upload failed");
      }
      return response.json();
    });
  }

  async matchCandidates(jobId) {
    return this.request(`/resume/match/${jobId}`);
  }

  async sendEmail({ from, to, subject, text}) {
    const res = await fetch(`${this.baseURL}/send-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from, to, subject, text}),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.error || 'Email sending failed');
    }

    return res.json();
  }
}

export default new ApiService();
