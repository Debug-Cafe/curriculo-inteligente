import type { Resume } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

const getAuthToken = () => localStorage.getItem('auth-token');

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erro na requisição');
  }

  return response.json();
};

export const api = {
  async saveResume(resume: Resume): Promise<Resume> {
    const method = resume.id ? 'PUT' : 'POST';
    const endpoint = resume.id ? `/resumes/${resume.id}` : '/resumes';

    return apiRequest(endpoint, {
      method,
      body: JSON.stringify(resume),
    });
  },

  async getResume(id: string): Promise<Resume> {
    return apiRequest(`/resumes/${id}`);
  },

  async getAllResumes(): Promise<Resume[]> {
    return apiRequest('/resumes');
  },

  async deleteResume(id: string): Promise<void> {
    await apiRequest(`/resumes/${id}`, {
      method: 'DELETE',
    });
  },
};
