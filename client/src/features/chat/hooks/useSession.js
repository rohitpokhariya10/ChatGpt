import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createLocalSession,
  setActiveSession,
  setSessions,
} from '../state/sessionSlice'

export function useSession() {
  const dispatch = useDispatch()
  const { sessions, activeSessionId } = useSelector((state) => state.chatSession)

  const activeSession = useMemo(
    () => sessions.find((item) => item.id === activeSessionId) || null,
    [sessions, activeSessionId],
  )

  const createSession = (title = 'New Chat') => {
    const session = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      messages: [],
    }
    dispatch(createLocalSession(session))
    return session
  }

  return {
    sessions,
    activeSession,
    activeSessionId,
    createSession,
    setActive: (id) => dispatch(setActiveSession(id)),
    hydrateSessions: (items) => dispatch(setSessions(items)),
  }
}
