import { httpClient } from '../../../shared/service/httpClient'

export const chatService = {
  // Placeholder for future chat APIs.
  listSessions() {
    return httpClient.get('/chat/sessions')
  },
}
