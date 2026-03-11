import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors globally
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Don't redirect if already on auth page
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.href = '/auth/login';
      }
    }
    return Promise.reject(err);
  }
);

export default api;

// ─── Helper wrappers ──────────────────────────────────────────────────────────
export const postsApi = {
  getAll:      (params) => api.get('/posts', { params }),
  getFeatured: ()       => api.get('/posts/featured'),
  getOne:      (slug)   => api.get(`/posts/${slug}`),
  create:      (data)   => api.post('/posts', data),
  update:      (id, data) => api.put(`/posts/${id}`, data),
  delete:      (id)     => api.delete(`/posts/${id}`),
  like:        (id)     => api.post(`/posts/${id}/like`),
  adminAll:    (params) => api.get('/posts/admin/all', { params }),
};

export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login:    (data) => api.post('/auth/login', data),
  getMe:    ()     => api.get('/auth/me'),
  update:   (data) => api.put('/auth/profile', data),
};

export const commentsApi = {
  getAll: (postId) => api.get(`/comments/${postId}`),
  add:    (postId, data) => api.post(`/comments/${postId}`, data),
  delete: (id)    => api.delete(`/comments/${id}`),
};

export const uploadApi = {
  image: (formData) => api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
};
