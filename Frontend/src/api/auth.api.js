import apiClient from './client';

export const authApi = {
  // Register a new user
  register: async ({ email, username, password }) => {
    const response = await apiClient.post('/auth/register', {
      email,
      username: username.toLowerCase().trim(),
      password,
    });
    return response.data;
  },

  // Login user with email & password
  login: async ({ email, password }) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password,
    });
    return response.data;
  },

  // Logout user & clear cookies
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // Get current logged-in user profile
  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/current-user');
    return response.data;
  },

  // Send forgot password email
  forgotPassword: async ({ email }) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset forgot password with token
  resetPassword: async ({ resetToken, newPassword }) => {
    const response = await apiClient.post(`/auth/reset-password/${resetToken}`, {
      newPassword,
    });
    return response.data;
  },

  // Verify email token
  verifyEmail: async (verificationToken) => {
    const response = await apiClient.get(`/auth/verify-email/${verificationToken}`);
    return response.data;
  },

  // Resend email verification
  resendEmailVerification: async () => {
    const response = await apiClient.post('/auth/resend-email-verification');
    return response.data;
  },

  // Change current password
  changePassword: async ({ oldPassword, newPassword }) => {
    const response = await apiClient.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return response.data;
  },
};
