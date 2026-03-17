import { useState } from 'react'
import { Sidebar } from './components/layout/Sidebar.jsx'
import { Header } from './components/layout/Header.jsx'
import { MobileNav } from './components/layout/MobileNav.jsx'
import { TodayPanel } from './components/today/TodayPanel.jsx'
import { Tasks } from './components/tasks/Tasks.jsx'
import { Schedule } from './components/schedule/Schedule.jsx'
import { Habits } from './components/habits/Habits.jsx'
import { Reminders } from './components/reminders/Reminders.jsx'
import { TasksProvider } from './contexts/TasksContext.jsx'
import { RemindersProvider } from './contexts/RemindersContext.jsx'

const SECTION_TITLES = {
  today: 'Today',
  tasks: 'Tasks',
  schedule: 'Schedule',
  habits: 'Habits',
  reminders: 'Reminders',
}

export default function App() {
  const [activeSection, setActiveSection] = useState('today')

  const title = SECTION_TITLES[activeSection] ?? 'Today'

  return (
    <RemindersProvider>
    <TasksProvider>
      <div className="flex h-screen overflow-hidden bg-gray-50">
        <Sidebar activeSection={activeSection} onNavigate={setActiveSection} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header title={title} />

          <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
            {activeSection === 'today' && <TodayPanel />}
            {activeSection === 'tasks' && <Tasks />}
            {activeSection === 'schedule' && <Schedule />}
            {activeSection === 'habits' && <Habits />}
            {activeSection === 'reminders' && <Reminders />}
          </main>
        </div>

        <MobileNav activeSection={activeSection} onNavigate={setActiveSection} />
      </div>
    </TasksProvider>
    </RemindersProvider>
  )
}
