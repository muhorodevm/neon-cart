import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    const adminToken = localStorage.getItem('adminAuth');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('adminAuth');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  signup: (data: { email: string; password: string; firstName: string; lastName: string; phone: string }) =>
    apiClient.post('/auth/signup', data),
  
  login: (data: { email: string; password: string }) =>
    apiClient.post('/auth/login', data),
  
  verifyOtp: (data: { email: string; otp: string }) =>
    apiClient.post('/auth/verify-otp', data),
  
  resendOtp: (data: { email: string }) =>
    apiClient.post('/auth/resend-otp', data),
  
  forgotPassword: (data: { email: string }) =>
    apiClient.post('/auth/forgot-password', data),
  
  resetPassword: (data: { token: string; password: string }) =>
    apiClient.post('/auth/reset-password', data),
};

// Admin Auth API
export const adminAuthApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post('/admin/login', data),
};

// User API
export const userApi = {
  getProfile: () =>
    apiClient.get('/user/profile'),
  
  updateProfile: (data: { firstName: string; lastName: string; phone: string }) =>
    apiClient.put('/user/profile', data),
  
  getAddresses: () =>
    apiClient.get('/user/addresses'),
  
  addAddress: (data: any) =>
    apiClient.post('/user/addresses', data),
  
  updateAddress: (id: string, data: any) =>
    apiClient.put(`/user/addresses/${id}`, data),
  
  deleteAddress: (id: string) =>
    apiClient.delete(`/user/addresses/${id}`),
};

// Product API
export const productApi = {
  getAll: (params?: { category?: string; subcategory?: string; search?: string }) =>
    apiClient.get('/products', { params }),
  
  getById: (id: string) =>
    apiClient.get(`/products/${id}`),
  
  create: (data: any) =>
    apiClient.post('/products', data),
  
  update: (id: string, data: any) =>
    apiClient.put(`/products/${id}`, data),
  
  delete: (id: string) =>
    apiClient.delete(`/products/${id}`),
  
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/products/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

// Order API
export const orderApi = {
  create: (data: any) =>
    apiClient.post('/orders', data),
  
  getMyOrders: () =>
    apiClient.get('/orders'),
  
  getById: (id: string) =>
    apiClient.get(`/orders/${id}`),
  
  getAllOrders: (params?: { status?: string; search?: string }) =>
    apiClient.get('/orders/admin/all', { params }),
  
  updateStatus: (id: string, status: string) =>
    apiClient.put(`/orders/${id}/status`, { status }),
};

// Payment API
export const paymentApi = {
  initiateMpesa: (data: { orderId: string; phoneNumber: string; amount: number }) =>
    apiClient.post('/payments/mpesa', data),
  
  getPaymentStatus: (transactionId: string) =>
    apiClient.get(`/payments/${transactionId}`),
};

// Admin API
export const adminApi = {
  getDashboardStats: () =>
    apiClient.get('/admin/stats'),
  
  getCustomers: (params?: { search?: string; page?: number; limit?: number }) =>
    apiClient.get('/admin/customers', { params }),
  
  getCustomerById: (id: string) =>
    apiClient.get(`/admin/customers/${id}`),
};
