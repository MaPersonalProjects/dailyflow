import { createContext, useContext } from 'react'
import { useReminders } from '../hooks/useReminders.js'

const RemindersContext = createContext(null)

export function RemindersProvider({ children }) {
  const value = useReminders()
  return <RemindersContext.Provider value={value}>{children}</RemindersContext.Provider>
}

export function useRemindersContext() {
  return useContext(RemindersContext)
}
