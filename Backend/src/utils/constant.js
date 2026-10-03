export const UserRolesEnum = {
  ADMIN: "admin",
  PROJECT_ADMIN: "project_admin",
  MEMBER: "member",
};

export const AvailableUserRole = Object.values(UserRolesEnum);

export const TaskStatusEnum = {
  TODO: "todo",
  IN_PROGRESS: "in_progress",
  DONE: "done",
};

export const AvailableTaskStatuses = Object.values(TaskStatusEnum);

export const DiscussionChannelEnum = {
  GENERAL: "general",
  ARCHITECTURE: "architecture",
  SPRINT_PLANNING: "sprint-planning",
  ANNOUNCEMENTS: "announcements",
  QA_BUGS: "qa-bugs",
  RANDOM: "random",
};

export const AvailableDiscussionChannels = Object.values(DiscussionChannelEnum);

export const EventTypeEnum = {
  MILESTONE: "milestone",
  MEETING: "meeting",
  RELEASE: "release",
  STANDUP: "standup",
  DEADLINE: "deadline",
};

export const AvailableEventTypes = Object.values(EventTypeEnum);
