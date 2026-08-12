import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {
  createLocalSession,
  fetchConversation,
  fetchConversations,
  sendChatMessage,
  setActiveSession,
} from '../state/sessionSlice'

const ACTIVE_CHAT_KEY = 'activeConversationId'

export function useSession() {
  const dispatch = useDispatch()

  const {
    sessions,
    activeSessionId,
    listStatus,
    detailStatus,
    sendStatus,
    error,
  } = useSelector((state) => state.chatSession)

  // ==========================================
  // FETCH ALL CONVERSATIONS
  // ==========================================
  useEffect(() => {
    dispatch(fetchConversations())
  }, [dispatch])

  // ==========================================
  // RESTORE ACTIVE CHAT AFTER RELOAD
  // ==========================================
  useEffect(() => {
    if (listStatus !== 'succeeded') return

    if (activeSessionId) return

    if (!sessions.length) return

    const savedConversationId =
      localStorage.getItem(ACTIVE_CHAT_KEY)

    const savedConversation = sessions.find(
      (item) => item.id === savedConversationId,
    )

    // If previously active conversation exists,
    // open the same conversation.
    if (savedConversation) {
      dispatch(
        setActiveSession(savedConversation.id),
      )

      if (savedConversation.messages === undefined) {
        dispatch(
          fetchConversation(savedConversation.id),
        )
      }

      return
    }

    // Otherwise open first available conversation.
    const firstConversation = sessions[0]

    dispatch(
      setActiveSession(firstConversation.id),
    )

    if (firstConversation.messages === undefined) {
      dispatch(
        fetchConversation(firstConversation.id),
      )
    }
  }, [
    listStatus,
    sessions,
    activeSessionId,
    dispatch,
  ])

  // ==========================================
  // ACTIVE SESSION
  // ==========================================
  const activeSession = useMemo(
    () =>
      sessions.find(
        (item) => item.id === activeSessionId,
      ) || null,
    [sessions, activeSessionId],
  )

  // ==========================================
  // SAVE ACTIVE SERVER CHAT ID
  // ==========================================
  useEffect(() => {
    if (!activeSession) return

    if (activeSession.isLocal) return

    localStorage.setItem(
      ACTIVE_CHAT_KEY,
      activeSession.id,
    )
  }, [activeSession])

  // ==========================================
  // CREATE LOCAL SESSION
  // ==========================================
  const createSession = (title = 'New Chat') => {
    const session = {
      id: crypto.randomUUID(),
      title,
      createdAt: new Date().toISOString(),
      messages: [],
      isLocal: true,
    }

    dispatch(createLocalSession(session))

    return session
  }

  // ==========================================
  // SELECT CONVERSATION
  // ==========================================
  const setActive = (id) => {
    dispatch(setActiveSession(id))

    localStorage.setItem(
      ACTIVE_CHAT_KEY,
      id,
    )

    dispatch(fetchConversation(id))
  }

  // ==========================================
  // SEND MESSAGE
  // ==========================================
  const sendMessage = (message) =>
    dispatch(
      sendChatMessage({
        message,

        conversationId:
          activeSession?.isLocal
            ? undefined
            : activeSession?.id,

        localSessionId:
          activeSession?.isLocal
            ? activeSession.id
            : undefined,
      }),
    ).unwrap()

  return {
    sessions,
    activeSession,
    activeSessionId,
    listStatus,

    activeSessionStatus:
      activeSessionId
        ? detailStatus[activeSessionId]
        : null,

    sendStatus,
    error,

    createSession,
    setActive,
    sendMessage,
  }
}