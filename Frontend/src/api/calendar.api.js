import apiClient from './client';

export const calendarApi = {
  // Fetch calendar events with filters
  getEvents: async ({ project, eventType, startDate, endDate, search } = {}) => {
    const params = {};
    if (project && project !== 'all') params.project = project;
    if (eventType && eventType !== 'all') params.eventType = eventType;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    if (search) params.search = search;

    const response = await apiClient.get('/calendar/events', { params });
    return response.data;
  },

  // Create a calendar event
  createEvent: async (eventData) => {
    const response = await apiClient.post('/calendar/events', eventData);
    return response.data;
  },

  // Get event by ID
  getEventById: async (eventId) => {
    const response = await apiClient.get(`/calendar/events/${eventId}`);
    return response.data;
  },

  // Update event
  updateEvent: async (eventId, data) => {
    const response = await apiClient.patch(`/calendar/events/${eventId}`, data);
    return response.data;
  },

  // Delete event
  deleteEvent: async (eventId) => {
    const response = await apiClient.delete(`/calendar/events/${eventId}`);
    return response.data;
  },

  // Get combined schedule (events + tasks with due dates)
  getSchedule: async ({ project, startDate, endDate } = {}) => {
    const params = {};
    if (project && project !== 'all') params.project = project;
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;

    const response = await apiClient.get('/calendar/schedule', { params });
    return response.data;
  },
};
