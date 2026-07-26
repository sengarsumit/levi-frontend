Based on your Project Levi implementation document, the frontend should be built feature-first and mirror the backend phases. The frontend should not be an afterthought—it should evolve alongside each backend phase.

## Frontend Tech Stack
| Category | Technology |
| --- | --- |
| Framework | React 19 + TypeScript |
| Build Tool | Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS |
| Components | shadcn/ui |
| Icons | Lucide React |
| State | Redux Toolkit + RTK Query |
| Forms | React Hook Form + Zod |
| Tables | TanStack Table |
| Drag & Drop | dnd-kit |
| Charts | Recharts |
| HTTP | Axios |
| Notifications | Sonner |
| Date | date-fns |
| Rich Text | TipTap |
| File Upload | React Dropzone |
| Authentication | JWT + Refresh Token |
| WebSockets | Socket.io Client |

## Folder Structure
```
src/
  app/
      store.ts
      routes.tsx
      App.tsx
  api/
      axios.ts
      authApi.ts
      projectApi.ts
      issueApi.ts
  components/
      ui/
      common/
      layout/
  features/
      auth/
      dashboard/
      organization/
      project/
      board/
      issue/
      sprint/
      comments/
      notifications/
      profile/
      settings/
  hooks/
  pages/
  utils/
  types/
  assets/
  styles/
```

## Phase 1 — Authentication
**Pages**
- Login
- Register
- Forgot Password
- Reset Password
- Verify Email
- Unauthorized
- 404

**Components**
- Login Form
- Register Form
- Password Strength
- OTP Input
- Remember Me
- Loader
- Protected Route

**Features**
- JWT Login
- Refresh Token
- Auto Logout
- Token Refresh
- Role Based Routing
- Persist Login

## Phase 2 — Organization
**Pages**
- Create Workspace
- Workspace Switcher
- Invite Members
- Members List
- Organization Settings

**Components**
- Workspace Card
- Member Table
- Invite Modal
- Role Dropdown

**Features**
- Organization-based Login (e.g., `/login/:orgSlug`)
- Custom Roles & RBAC (Role-Based Access Control)
- Permission-based task transition & project creation

## Phase 3 — Projects
**Pages**
- Projects Dashboard
- Create Project
- Project Details
- Archived Projects

**Components**
- Project Card
- Project Table
- Search
- Filter
- Create Project Modal

**Features**
- Search
- Pagination
- Sorting
- Filters
- Infinite Scroll

## Phase 4 — Kanban Board
This is the largest frontend module.

**Pages**
- Board
- Issue Details
- Create Issue

**Components**
- Kanban Board
- Columns
- Cards
- Issue Drawer
- Issue Modal
- Priority Badge
- Status Badge
- Labels
- Assignee Avatar
- Story Points

**Features**
- Drag Drop
- Optimistic Updates
- Column Collapse
- Card Sorting
- Filters
- Search
- Quick Edit
- Keyboard Navigation

## Phase 5 — Comments
**Pages**
- Activity Timeline

**Components**
- Comment Box
- Mention Users
- Emoji Picker
- Markdown Editor
- Activity Feed

**Features**
- Infinite comments
- Live updates
- Edit/Delete
- Thread replies

## Phase 6 — Sprint
**Pages**
- Sprint Planning
- Backlog
- Active Sprint
- Completed Sprint

**Components**
- Sprint Card
- Sprint Timeline
- Velocity Chart
- Burndown Chart

**Features**
- Drag task to sprint
- Start Sprint
- End Sprint
- Move Issue

## Phase 7 — Notifications
**Components**
- Notification Bell
- Notification Drawer
- Unread Badge
- Toast
- Live Notification

**Features**
- WebSocket updates
- Mark Read
- Mark All Read

## Phase 8 — Redis Optimizations
**Frontend Changes**
- Prefetch API
- Cache Lists
- Invalidate Cache
- Background Refresh
- Skeleton Loading

RTK Query handles most caching.

## Phase 9 — File Upload
**Components**
- Dropzone
- Image Preview
- Attachment List
- Progress Bar
- PDF Viewer

**Features**
- Multiple Upload
- Drag Upload
- Retry Upload
- Cancel Upload

## Phase 10 — Admin
**Pages**
- Users
- Roles
- Permissions
- Audit Logs
- System Settings

**Components**
- Permission Matrix
- Role Editor
- Audit Table

## Phase 11 — Dashboard
**Dashboard Widgets**
- My Tasks
- Projects
- Sprint Progress
- Assigned Issues
- Recent Activity
- Notifications
- Productivity Chart
- Calendar
- Upcoming Deadlines

**Charts**
- Task Distribution
- Issues by Status
- Issues by Priority
- Sprint Velocity
- Burndown
- Weekly Progress

## Phase 12 — Time Tracking & Shifts
**Pages**
- Timesheet
- Shift Management

**Components**
- Shift Scheduler
- Working Hours Configurator
- Time Log Table

**Features**
- Calculate task time based on user shifts (e.g., 9-6)
- Automatically exclude weekends and non-working hours

## Responsive Design
**Desktop**
- Sidebar
- Top Navbar
- Board View

**Tablet**
- Collapsible Sidebar
- Stacked Layout

**Mobile**
- Bottom Navigation
- Drawer Menu
- Single Column
- Swipe Support

## Route Structure
```
/
├── login
├── register
├── dashboard
│      ├── user
│      ├── project
│      └── organization
├── organization
├── projects
│      ├── create
│      ├── :projectId
│      ├── board
│      ├── backlog
│      ├── sprint
│      └── settings
├── issues
│      └── :issueId
├── profile
├── notifications
├── admin
└── settings
```

## Global Layout
- Header
- Sidebar
- Breadcrumbs
- Page Title
- Content Area
- Footer

## Global Components
- Search Bar
- Theme Toggle
- Command Palette
- Breadcrumb
- Confirmation Dialog
- Loader
- Error Boundary
- Pagination
- Modal
- Drawer
- Tooltip
- Popover
- Dropdown
- Avatar
- Toast
- Skeleton
- Empty State
- Data Table
- Date Picker
- Calendar
- Infinite Scroll

## API Integration Strategy
**RTK Query**
- Authentication APIs
- Organization APIs
- Project APIs
- Board APIs
- Issue APIs
- Sprint APIs
- Notification APIs
- Comment APIs
- User APIs
- Settings APIs

## Suggested Frontend Development Order
1. Project setup (Vite, TypeScript, Tailwind CSS, shadcn/ui, routing, Redux Toolkit).
2. Authentication (login, registration, protected routes, JWT handling).
3. Global layout (sidebar, navbar, theme, routing shell).
4. Organization/workspace management.
5. Project CRUD and dashboard.
6. Kanban board with drag-and-drop.
7. Issue details, comments, and activity timeline.
8. Sprint planning and backlog.
9. Real-time notifications (WebSockets).
10. File uploads and attachments.
11. Analytics dashboard and reporting.
12. Admin panel (roles, permissions, audit logs).
13. Performance optimization (lazy loading, RTK Query caching, code splitting, accessibility, responsive refinements).

This sequence aligns closely with the backend phases described in your Project Levi specification, allowing frontend and backend development to progress in parallel with minimal integration friction.
