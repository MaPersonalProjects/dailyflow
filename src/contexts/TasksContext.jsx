import { createContext, useContext } from 'react'
import { useTasks } from '../hooks/useTasks.js'

const TasksContext = createContext(null)

export function TasksProvider({ children }) {
  const value = useTasks()
  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
}

export function useTasksContext() {
  return useContext(TasksContext)
}
