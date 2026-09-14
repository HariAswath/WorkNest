import apiClient from './client';

export const noteApi = {
  // Get all notes for a project
  getNotes: async (projectId) => {
    const response = await apiClient.get(`/notes/${projectId}`);
    return response.data;
  },

  // Get note by ID
  getNoteById: async (projectId, noteId) => {
    const response = await apiClient.get(`/notes/${projectId}/n/${noteId}`);
    return response.data;
  },

  // Create a new note in project
  createNote: async (projectId, noteData) => {
    const response = await apiClient.post(`/notes/${projectId}`, noteData);
    return response.data;
  },

  // Update note content
  updateNote: async (projectId, noteId, noteData) => {
    const response = await apiClient.put(`/notes/${projectId}/n/${noteId}`, noteData);
    return response.data;
  },

  // Delete a note
  deleteNote: async (projectId, noteId) => {
    const response = await apiClient.delete(`/notes/${projectId}/n/${noteId}`);
    return response.data;
  },
};
