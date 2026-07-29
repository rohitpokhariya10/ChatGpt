import { useMemo } from 'react'
import { useAuth } from '../../../auth/hooks/useAuth'
import { useSession } from '../../hooks/useSession'

export function ChatPage() {
  const { user, logout } = useAuth()
  const { sessions, activeSession, createSession, setActive } = useSession()

  const sortedSessions = useMemo(
    () => [...sessions].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [sessions],
  )

  return (
    <div className="grid min-h-screen grid-cols-1 bg-white text-[#0D0D0D] dark:bg-[#212121] dark:text-[#ECECEC] md:grid-cols-[260px_1fr]">
      <aside
        className="border-b border-[#E5E5E5] bg-[#F7F7F8] p-4 dark:border-[#3A3A3A] dark:bg-[#2F2F2F] md:border-b-0 md:border-r"
        aria-label="Conversation sidebar"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-semibold">Conversations</h2>
          <button
            className="rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-[13px] transition-colors hover:bg-[#f2f2f3] dark:border-[#3A3A3A] dark:bg-[#212121] dark:hover:bg-[#3a3a3a]"
            type="button"
            onClick={() => createSession('Untitled chat')}
          >
            New chat
          </button>
        </div>
        <ul className="grid list-none gap-2 p-0">
          {sortedSessions.map((session) => (
            <li key={session.id}>
              <button
                type="button"
                className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                  session.id === activeSession?.id
                    ? 'border-[#10A37F] bg-[#e8f5f2] dark:bg-[#1f3a34]'
                    : 'border-[#E5E5E5] bg-white hover:bg-[#f2f2f3] dark:border-[#3A3A3A] dark:bg-[#212121] dark:hover:bg-[#3a3a3a]'
                }`}
                onClick={() => setActive(session.id)}
              >
                {session.title}
              </button>
            </li>
          ))}
          {!sortedSessions.length && (
            <li className="text-[13px] text-[#6E6E80] dark:text-[#A9A9B3]">No sessions yet</li>
          )}
        </ul>
      </aside>

      <section className="grid grid-rows-[auto_1fr_auto] gap-4 p-4">
        <header className="flex items-center justify-between rounded-xl border border-[#E5E5E5] bg-[#F7F7F8] px-4 py-3 dark:border-[#3A3A3A] dark:bg-[#2F2F2F]">
          <div>
            <h1 className="text-lg font-semibold">ChatGPT Clone</h1>
            <p className="text-[13px] text-[#6E6E80] dark:text-[#A9A9B3]">{user?.email}</p>
          </div>
          <button
            className="rounded-lg border border-[#E5E5E5] bg-white px-3 py-2 text-sm transition-colors hover:bg-[#f2f2f3] dark:border-[#3A3A3A] dark:bg-[#212121] dark:hover:bg-[#3a3a3a]"
            type="button"
            onClick={logout}
          >
            Logout
          </button>
        </header>

        <div
          className="w-full max-w-[768px] rounded-xl border border-[#E5E5E5] bg-[#F7F7F8] p-4 dark:border-[#3A3A3A] dark:bg-[#2F2F2F]"
          role="region"
          aria-label="Conversation panel"
        >
          {activeSession ? (
            <>
              <h3 className="mb-2 text-base font-semibold">{activeSession.title}</h3>
              <p className="text-[15px] leading-relaxed text-[#6E6E80] dark:text-[#A9A9B3]">
                Message stream and model responses can be integrated here.
              </p>
            </>
          ) : (
            <p className="text-[15px] leading-relaxed text-[#6E6E80] dark:text-[#A9A9B3]">
              Create or select a session to start chatting.
            </p>
          )}
        </div>

        <div
          className="grid w-full max-w-[768px] grid-cols-[1fr_auto] gap-2 rounded-[24px] border border-[#E5E5E5] bg-[#F7F7F8] p-2 dark:border-[#3A3A3A] dark:bg-[#2F2F2F]"
          aria-label="Message composer"
        >
          <input
            className="border-none bg-transparent px-3 py-2 text-[15px] outline-none placeholder:text-[#6E6E80] dark:placeholder:text-[#A9A9B3]"
            type="text"
            placeholder="Message ChatGPT clone"
          />
          <button
            className="rounded-full bg-[#10A37F] px-4 py-2 text-sm text-white transition-colors hover:bg-[#1A7F64]"
            type="button"
          >
            Send
          </button>
        </div>
      </section>
    </div>
  )
}
