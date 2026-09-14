import apiClient from './client';

export const taskApi = {
  // Get all tasks for a project
  getTasks: async (projectId) => {
    const response = await apiClient.get(`/tasks/${projectId}`);
    return response.data;
  },

  // Get task by ID (with subtasks and assignee)
  getTaskById: async (projectId, taskId) => {
    const response = await apiClient.get(`/tasks/${projectId}/t/${taskId}`);
    return response.data;
  },

  // Create task in a project
  createTask: async (projectId, taskData) => {
    const response = await apiClient.post(`/tasks/${projectId}`, taskData);
    return response.data;
  },

  // Update task (status, title, description, assignedTo)
  updateTask: async (projectId, taskId, updateData) => {
    const response = await apiClient.put(`/tasks/${projectId}/t/${taskId}`, updateData);
    return response.data;
  },

  // Delete task
  deleteTask: async (projectId, taskId) => {
    const response = await apiClient.delete(`/tasks/${projectId}/t/${taskId}`);
    return response.data;
  },

  // Create a subtask under a task
  createSubTask: async (projectId, taskId, { title }) => {
    const response = await apiClient.post(`/tasks/${projectId}/t/${taskId}/subtasks`, {
      title,
    });
    return response.data;
  },

  // Update subtask (title, isCompleted)
  updateSubTask: async (projectId, subTaskId, { title, isCompleted }) => {
    const response = await apiClient.put(`/tasks/${projectId}/st/${subTaskId}`, {
      title,
      isCompleted,
    });
    return response.data;
  },

  // Delete subtask
  deleteSubTask: async (projectId, subTaskId) => {
    const response = await apiClient.delete(`/tasks/${projectId}/st/${subTaskId}`);
    return response.data;
  },
};
