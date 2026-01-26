import { createCollection, localOnlyCollectionOptions } from '@tanstack/db'
import type { MonitorSession, MonitorAction } from './protocol'

export const sessionsCollection = createCollection(
  localOnlyCollectionOptions<MonitorSession>({
    id: 'clawdbot-sessions',
    getKey: (item) => item.key,
  })
)

export const actionsCollection = createCollection(
  localOnlyCollectionOptions<MonitorAction>({
    id: 'clawdbot-actions',
    getKey: (item) => item.id,
  })
)

// Helper to update or insert session
export function upsertSession(session: MonitorSession) {
  const existing = sessionsCollection.state.get(session.key)
  if (existing) {
    sessionsCollection.update(session.key, (draft) => {
      Object.assign(draft, session)
    })
  } else {
    sessionsCollection.insert(session)
  }
}

// Helper to add or update action
// For deltas, we aggregate into a single "streaming" action per runId
export function addAction(action: MonitorAction) {
  // For deltas, use runId as the key (aggregate all deltas)
  if (action.type === 'delta') {
    const streamingId = `${action.runId}-stream`
    const existing = actionsCollection.state.get(streamingId)
    if (existing) {
      // Append content to existing streaming action
      actionsCollection.update(streamingId, (draft) => {
        draft.content = (draft.content || '') + (action.content || '')
        draft.seq = action.seq
        draft.timestamp = action.timestamp
      })
    } else {
      // Create new streaming action
      actionsCollection.insert({
        ...action,
        id: streamingId,
      })
    }
    return
  }

  // For final/error/aborted, update the streaming action's type
  if (action.type === 'final' || action.type === 'error' || action.type === 'aborted') {
    const streamingId = `${action.runId}-stream`
    const streaming = actionsCollection.state.get(streamingId)
    if (streaming) {
      actionsCollection.update(streamingId, (draft) => {
        draft.type = action.type
        draft.seq = action.seq
        draft.timestamp = action.timestamp
      })
      return
    }
    // No streaming action found, create as-is
  }

  // For tool_call/tool_result or orphaned finals, add as new
  const existing = actionsCollection.state.get(action.id)
  if (!existing) {
    actionsCollection.insert(action)
  }
}

// Helper to update session status
export function updateSessionStatus(
  key: string,
  status: MonitorSession['status']
) {
  const session = sessionsCollection.state.get(key)
  if (session) {
    sessionsCollection.update(key, (draft) => {
      draft.status = status
      draft.lastActivityAt = Date.now()
    })
  }
}

// Helper to update partial session data
export function updateSession(key: string, update: Partial<MonitorSession>) {
  const session = sessionsCollection.state.get(key)
  if (session) {
    sessionsCollection.update(key, (draft) => {
      Object.assign(draft, update)
    })
  }
}

// Clear all data
export function clearCollections() {
  for (const session of sessionsCollection.state.values()) {
    sessionsCollection.delete(session.key)
  }
  for (const action of actionsCollection.state.values()) {
    actionsCollection.delete(action.id)
  }
}
