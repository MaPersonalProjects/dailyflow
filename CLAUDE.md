# DailyFlow

A personal productivity app for managing tasks, schedules, habits,
meetings, and reminders — all in one place, offline-first.

## Tech Stack
- React + Vite
- Tailwind CSS
- localStorage (no backend, no auth)
- date-fns (date formatting and comparison)
- react-beautiful-dnd (drag to reorder tasks)

## Project Structure
src/
├── components/
│   ├── layout/         # Sidebar, Header, MobileNav
│   ├── dashboard/      # DailySummary, UpcomingWidget, HabitRing
│   ├── tasks/          # TaskCard, TaskForm, TaskList, TaskFilter
│   ├── schedule/       # DayView, WeekView, TimeBlock, MeetingCard
│   ├── habits/         # HabitCard, HabitForm, HabitGrid, StreakBadge
│   └── reminders/      # ReminderCard, ReminderForm, ReminderList
├── hooks/
│   ├── useTasks.js     # CRUD, priority, status, due dates
│   ├── useSchedule.js  # time blocks, meetings, calendar state
│   ├── useHabits.js    # habit tracking, streaks, completion
│   ├── useReminders.js # reminders, browser notifications
│   └── useDashboard.js # aggregates data for summary view
├── utils/
│   ├── dateHelpers.js  # today, isOverdue, formatTime, groupByDay
│   ├── storage.js      # localStorage get/set/clear wrappers
│   └── recurrence.js   # daily/weekly/monthly recurrence logic
└── constants.js        # priorities, categories, repeat options

## Common Commands
```bash
npm run dev        # start dev server (localhost:5173)
npm run build      # production build
npm run preview    # preview build
npm run test       # run tests
npm run lint       # eslint
```

## Core Features
1. **Dashboard** — daily summary, today's tasks, upcoming meetings,
   habit completion rings, overdue alerts
2. **Tasks / To-Do** — add tasks with title, priority, category,
   due date, notes; mark complete; drag to reorder
3. **Schedule** — day and week view, add time blocks and meetings
   with title, time, duration, color label
4. **Habits** — daily habits with streak tracking, completion grid
   (last 30 days), category tags
5. **Reminders** — one-time or recurring reminders, browser
   notification support via Notification API

## Data Shapes

### Task
```js
{
  id: number,
  title: string,
  notes: string,
  priority: 'high' | 'medium' | 'low',
  category: string,
  dueDate: string,       // ISO date
  dueTime: string,       // 'HH:mm' optional
  completed: boolean,
  completedAt: string,   // ISO datetime
  createdAt: string
}
```

### Meeting / Time Block
```js
{
  id: number,
  title: string,
  date: string,          // ISO date
  startTime: string,     // 'HH:mm'
  endTime: string,       // 'HH:mm'
  type: 'meeting' | 'block' | 'event',
  color: string,         // Tailwind color key
  notes: string,
  recurring: string      // 'none'|'daily'|'weekly'|'monthly'
}
```

### Habit
```js
{
  id: number,
  title: string,
  category: string,
  targetDays: string[],  // ['mon','tue','wed','thu','fri']
  completions: string[], // ISO date strings of completed days
  createdAt: string,
  color: string,
  streak: number
}
```

### Reminder
```js
{
  id: number,
  title: string,
  datetime: string,      // ISO datetime
  recurring: string,     // 'none'|'daily'|'weekly'|'monthly'
  notified: boolean,
  done: boolean
}
```

## Coding Standards
- Functional components only, no class components
- All state logic lives in hooks — components stay thin
- No prop drilling beyond 2 levels — use context for global state
- Tailwind for all styling — no inline styles
- All components must have PropTypes
- Prefer named exports

## Workflow
- Use Plan Mode for any task touching 3+ files
- Build order: constants → utils → hooks → components → App
- Commit after each phase
- One feature per branch

## Out of Scope
- No backend, no cloud sync, no user accounts
- No third-party calendar integration (Google Cal, etc.)
- No mobile push notifications (browser Notification API only)
```
