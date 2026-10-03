# WorkNest — High-Velocity Project Management Studio

<div align="center">
  <img src="Frontend/public/logo.png" alt="WorkNest Logo" width="100" height="100" />
  <h3>Plan. Collaborate. Deliver.</h3>
  <p>The modern, dark-studio workspace built for focused engineering teams moving at high velocity.</p>

  <div>
    <img src="https://img.shields.io/badge/Frontend-React%2018%20%7C%20Vite-61DAFB?style=flat-square&logo=react" alt="React Vite" />
    <img src="https://img.shields.io/badge/Styling-TailwindCSS%20v4-38B2AC?style=flat-square&logo=tailwind-css" alt="TailwindCSS" />
    <img src="https://img.shields.io/badge/Backend-Node.js%20%7C%20Express-339933?style=flat-square&logo=node.js" alt="Node Express" />
    <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb" alt="MongoDB" />
    <img src="https://img.shields.io/badge/Auth-JWT%20%26%20Cookies-black?style=flat-square&logo=json-web-tokens" alt="JWT" />
    <img src="https://img.shields.io/badge/Deployment-Vercel%20%2B%20Render-black?style=flat-square&logo=vercel" alt="Vercel Render" />
  </div>
</div>

---

## Features Overview

### 1. Visual Kanban & Subtask Engine
- **Customizable Pipelines**: Organize project workflows with dynamic stages (*To Do, In Progress, In Review, Completed*).
- **Subtask Hierarchy**: Break complex tasks into subtasks with real-time percentage completion tracking.
- **Priority & Due Date Badges**: Urgent, High, Medium, and Low priority routing with visual countdown indicators.
- **File Attachments**: Upload and link technical assets, logs, and screenshots directly to task cards.

### 2. Threaded Discussions & RFC Hub
- **Team Discussion Channels**: Dedicated channels for `#architecture`, `#sprint-retrospectives`, and `#frontend-ux`.
- **Pinned Specifications**: Pin key architectural RFCs and decisions with syntax-highlighted code blocks.
- **Reactions & @Mentions**: Engage with team replies via reaction counts and inline discussion threads.

### 3. Sprint & Milestone Calendar
- **Full Calendar Timeline**: View sprint deliverables, product launch milestones, and scheduled syncs on a monthly calendar grid.
- **Color-Coded Priority Events**: Identify deadlines and active sprints at a glance.
- **Interactive Day Selector**: Inspect day-specific task agendas and milestones.

### 4. Granular Role-Based Access Control (RBAC)
- **Role Permissions**: Three-tier permission architecture:
  - **Admin / Workspace Owner**: Full access to project configuration, members, roles, notes, and task pipelines.
  - **Project Admin**: Create, edit, and delete tasks and subtasks within assigned spaces.
  - **Team Member**: View projects, mark subtasks complete, and participate in discussions.
- **Session Security**: HTTP-only JWT cookies, encrypted refresh tokens, CSRF protection, and email verification.

### 5. Developer Webhooks & Integrations
- **Slack & Discord Alerts**: Automatic webhook dispatches on task status mutations and comments.
- **API Token Management**: Generate bearer tokens for REST integration with CI/CD and CLI pipelines.
- **Data Sovereignty**: Export complete workspace snapshots into JSON anytime.

### 6. Dark Studio Design System
- **Obsidian Dark Studio Aesthetics**: High-contrast `#0d0e12` / `#16181d` surfaces paired with glowing amber/gold accents.
- **Customization**: Theme modes, density controls (Compact/Comfortable), custom avatar themes, and sound toggles.

---

## Architecture & Tech Stack

```
project-management-application/
├── Frontend/                 # React 18 + Vite SPA Client
│   ├── public/               # Static assets & WorkNest branding (logo.png)
│   ├── src/
│   │   ├── api/              # Axios API client & endpoint services
│   │   ├── components/       # Reusable UI (Studio Shell, Kanban, Navbar, Footer)
│   │   ├── context/          # Auth & Global Workspace State
│   │   ├── pages/            # Landing, Auth, Dashboard, Workspace, Discussions, Calendar, Settings
│   │   └── App.jsx           # App routing & protected routes
│   └── vercel.json           # Vercel SPA routing rules
│
└── Backend/                  # Express.js REST API Server
    ├── api/                  # Vercel Serverless entrypoint (optional)
    ├── src/
    │   ├── controllers/      # Auth, Project, Task, Note, Discussion, Calendar controllers
    │   ├── db/               # MongoDB Mongoose connection
    │   ├── middleware/       # JWT Auth, RBAC permissions, error handlers, multer upload
    │   ├── models/           # User, Project, Task, Subtask, Note, Discussion, Calendar schemas
    │   ├── routes/           # RESTful API route definitions
    │   ├── utils/            # Async handler, API responses, Mailgen email dispatch
    │   ├── app.js            # Express app middleware & CORS configuration
    │   └── index.js          # Node.js server listener
    └── vercel.json           # Backend Vercel configuration
```

---

## Getting Started (Local Development)

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm** or **yarn** / **pnpm**
- **MongoDB Atlas** cluster or local MongoDB instance

### 1. Clone the Repository
```bash
git clone https://github.com/HariAswath/project-management-application.git
cd project-management-application
```

### 2. Configure Backend
```bash
cd Backend
npm install
```

Create a `.env` file inside `Backend/`:
```env
PORT=8000
NODE_ENV=development
MONGO_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/worknest?retryWrites=true&w=majority
CORS_ORIGIN=http://localhost:5173

ACCESS_TOKEN_SECRET=your_super_secret_access_jwt_key
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_super_secret_refresh_jwt_key
REFRESH_TOKEN_EXPIRY=10d

# Mailtrap / SMTP Email Configuration
MAILTRAP_SMTP_HOST=sandbox.smtp.mailtrap.io
MAILTRAP_SMTP_PORT=2525
MAILTRAP_SMTP_USER=your_mailtrap_user
MAILTRAP_SMTP_PASS=your_mailtrap_password

FORGOT_PASSWORD_REDIRECT_URL=http://localhost:5173/reset-password
```

Start Backend:
```bash
npm run dev
# Server running on http://localhost:8000
```

### 3. Configure Frontend
```bash
cd ../Frontend
npm install
```

Create a `.env` file inside `Frontend/` (optional for local proxy):
```env
VITE_API_URL=http://localhost:8000
```

Start Frontend:
```bash
npm run dev
# App running on http://localhost:5173
```

---

## REST API Documentation

Base URL: `/api/v1`

### Authentication (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/register` | Register new user account | Public |
| `POST` | `/login` | Authenticate & issue JWT tokens | Public |
| `POST` | `/logout` | Invalidate session & clear cookies | Authenticated |
| `GET` | `/current-user` | Retrieve authenticated profile | Authenticated |
| `POST` | `/change-password` | Update user password | Authenticated |
| `POST` | `/refresh-token` | Renew access token via refresh token | Public |
| `GET` | `/verify-email/:token` | Verify email address token | Public |
| `POST` | `/forgot-password` | Send password reset email | Public |
| `POST` | `/reset-password/:token` | Reset password with token | Public |

### Projects (`/api/v1/projects`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/` | List all accessible workspaces | Authenticated |
| `POST` | `/` | Create a new project workspace | Authenticated |
| `GET` | `/:projectId` | Get project metadata & member count | Member+ |
| `PUT` | `/:projectId` | Update project name / description | Admin |
| `DELETE` | `/:projectId` | Delete project workspace | Admin |
| `GET` | `/:projectId/members` | List project members & assigned roles | Member+ |
| `POST` | `/:projectId/members` | Invite member via email & assign role | Admin |
| `PUT` | `/:projectId/members/:userId` | Update member role (*admin / member*) | Admin |
| `DELETE` | `/:projectId/members/:userId` | Remove member from workspace | Admin |

### Tasks & Subtasks (`/api/v1/tasks`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/:projectId` | List all project tasks | Member+ |
| `POST` | `/:projectId` | Create task with priority & assignee | Admin / Project Admin |
| `GET` | `/:projectId/t/:taskId` | Get task details & subtasks | Member+ |
| `PUT` | `/:projectId/t/:taskId` | Update task title, status, or assignee | Admin / Project Admin |
| `DELETE` | `/:projectId/t/:taskId` | Delete task from workspace | Admin / Project Admin |
| `POST` | `/:projectId/t/:taskId/subtasks` | Add subtask to task | Admin / Project Admin |
| `PUT` | `/:projectId/st/:subTaskId` | Toggle subtask completion status | Member+ |
| `DELETE` | `/:projectId/st/:subTaskId` | Delete subtask | Admin / Project Admin |

### Discussions (`/api/v1/discussions`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/:projectId` | List all channel threads | Member+ |
| `POST` | `/:projectId` | Create a discussion or RFC thread | Member+ |
| `GET` | `/:projectId/d/:discussionId` | Get thread & replies | Member+ |
| `POST` | `/:projectId/d/:discussionId/comments` | Add comment / reply | Member+ |
| `POST` | `/:projectId/d/:discussionId/reactions` | Toggle emoji reaction | Member+ |
| `PUT` | `/:projectId/d/:discussionId/pin` | Pin/unpin discussion RFC | Admin |

### Calendar (`/api/v1/calendar`)
| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/:projectId` | Fetch project calendar milestones & events | Member+ |
| `POST` | `/:projectId` | Create new milestone or deadline event | Admin / Project Admin |
| `PUT` | `/:projectId/e/:eventId` | Update calendar event | Admin / Project Admin |
| `DELETE` | `/:projectId/e/:eventId` | Delete calendar event | Admin / Project Admin |

---

## Production Deployment Guide

### Deploying Backend on Render
1. Create a **Web Service** on [render.com](https://render.com).
2. Connect your GitHub repository:
   - **Root Directory**: `Backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
3. Add environment variables (`MONGO_URL`, `ACCESS_TOKEN_SECRET`, `REFRESH_TOKEN_SECRET`, `CORS_ORIGIN`, `NODE_ENV=production`, etc.).
4. Copy the live API URL (e.g. `https://worknest-api.onrender.com`).

### Deploying Frontend on Vercel
1. Create a **New Project** on [vercel.com](https://vercel.com).
2. Import the repository:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `Frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Add environment variable:
   - `VITE_API_URL`: `https://worknest-api.onrender.com`
4. Click **Deploy**.

---

## Role Permissions Matrix

| Capability | Admin (Owner) | Project Admin | Member |
|---|:---:|:---:|:---:|
| Create / Delete Workspace | Yes | No | No |
| Manage Team Roles & Invites | Yes | No | No |
| Create / Edit Tasks | Yes | Yes | No |
| Update Subtask Completion | Yes | Yes | Yes |
| Post in Discussions & RFCs | Yes | Yes | Yes |
| Pin Architecture RFCs | Yes | No | No |
| Create Calendar Milestones | Yes | Yes | No |
| Configure Webhooks & Tokens | Yes | No | No |

---

## License
This project is licensed under the [ISC License](LICENSE).

<div align="center">
  <sub>Crafted with precision for high-output engineering teams. WorkNest Studio Inc.</sub>
</div>
