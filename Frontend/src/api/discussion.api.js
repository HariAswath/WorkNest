import apiClient from './client';

export const discussionApi = {
  // Fetch discussions with optional channel, project, tag, search filters
  getDiscussions: async ({ channel, project, tag, search } = {}) => {
    const params = {};
    if (channel && channel !== 'all') params.channel = channel;
    if (project && project !== 'all') params.project = project;
    if (tag) params.tag = tag;
    if (search) params.search = search;

    const response = await apiClient.get('/discussions', { params });
    return response.data;
  },

  // Create a new discussion thread
  createDiscussion: async ({ title, content, channel, project, tags, linkedTasks }) => {
    const response = await apiClient.post('/discussions', {
      title,
      content,
      channel: channel || 'general',
      project: project || null,
      tags: tags || [],
      linkedTasks: linkedTasks || [],
    });
    return response.data;
  },

  // Get a single discussion by ID
  getDiscussionById: async (discussionId) => {
    const response = await apiClient.get(`/discussions/${discussionId}`);
    return response.data;
  },

  // Update a discussion thread
  updateDiscussion: async (discussionId, data) => {
    const response = await apiClient.patch(`/discussions/${discussionId}`, data);
    return response.data;
  },

  // Delete a discussion thread
  deleteDiscussion: async (discussionId) => {
    const response = await apiClient.delete(`/discussions/${discussionId}`);
    return response.data;
  },

  // Toggle Pin on discussion
  togglePinDiscussion: async (discussionId) => {
    const response = await apiClient.post(`/discussions/${discussionId}/pin`);
    return response.data;
  },

  // Toggle emoji reaction on discussion
  toggleDiscussionReaction: async (discussionId, emoji) => {
    const response = await apiClient.post(`/discussions/${discussionId}/react`, { emoji });
    return response.data;
  },

  // Fetch replies for a discussion
  getReplies: async (discussionId) => {
    const response = await apiClient.get(`/discussions/${discussionId}/replies`);
    return response.data;
  },

  // Create a reply
  createReply: async (discussionId, { content, parentReply } = {}) => {
    const response = await apiClient.post(`/discussions/${discussionId}/replies`, {
      content,
      parentReply: parentReply || null,
    });
    return response.data;
  },

  // Delete a reply
  deleteReply: async (discussionId, replyId) => {
    const response = await apiClient.delete(`/discussions/${discussionId}/replies/${replyId}`);
    return response.data;
  },

  // Toggle reaction on a reply
  toggleReplyReaction: async (replyId, emoji) => {
    const response = await apiClient.post(`/discussions/replies/${replyId}/react`, { emoji });
    return response.data;
  },
};
