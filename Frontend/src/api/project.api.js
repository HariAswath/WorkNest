import apiClient from './client';

export const projectApi = {
  // Get all projects for current user
  getProjects: async () => {
    const response = await apiClient.get('/projects');
    return response.data;
  },

  // Get project by ID
  getProjectById: async (projectId) => {
    const response = await apiClient.get(`/projects/${projectId}`);
    return response.data;
  },

  // Create a new project
  createProject: async ({ name, description }) => {
    const response = await apiClient.post('/projects', {
      name,
      description,
    });
    return response.data;
  },

  // Update existing project
  updateProject: async (projectId, { name, description }) => {
    const response = await apiClient.put(`/projects/${projectId}`, {
      name,
      description,
    });
    return response.data;
  },

  // Delete project
  deleteProject: async (projectId) => {
    const response = await apiClient.delete(`/projects/${projectId}`);
    return response.data;
  },

  // Get project members
  getProjectMembers: async (projectId) => {
    const response = await apiClient.get(`/projects/${projectId}/members`);
    return response.data;
  },

  // Add member to project
  addMemberToProject: async (projectId, { email, role }) => {
    const response = await apiClient.post(`/projects/${projectId}/members`, {
      email,
      role,
    });
    return response.data;
  },

  // Update member role
  updateMemberRole: async (projectId, userId, newRole) => {
    const response = await apiClient.put(`/projects/${projectId}/members/${userId}`, {
      newRole,
    });
    return response.data;
  },

  // Delete/remove member from project
  deleteMember: async (projectId, userId) => {
    const response = await apiClient.delete(`/projects/${projectId}/members/${userId}`);
    return response.data;
  },
};
