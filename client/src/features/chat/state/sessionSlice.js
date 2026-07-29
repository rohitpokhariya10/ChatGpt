import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  activeSessionId: null,
  sessions: [],
}

const sessionSlice = createSlice({
  name: 'chatSession',
  initialState,
  reducers: {
    setSessions(state, action) {
      state.sessions = action.payload
    },
    createLocalSession(state, action) {
      state.sessions.unshift(action.payload)
      state.activeSessionId = action.payload.id
    },
    setActiveSession(state, action) {
      state.activeSessionId = action.payload
    },
    clearSessions() {
      return { ...initialState }
    },
  },
})

export const { setSessions, createLocalSession, setActiveSession, clearSessions } =
  sessionSlice.actions

export default sessionSlice.reducer
