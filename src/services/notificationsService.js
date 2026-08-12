import { api } from './api'

/**
 * In-app notifications.
 *
 * The backend raises these from inside the transaction that caused them - an
 * order placed, a job accepted, a line marked ready - so the feed is a record
 * of what actually happened rather than a best-effort side channel.
 */
function adaptNotification(notification) {
  return {
    id: notification.id,
    type: notification.type,
    message: notification.message,
    payload: notification.payload ?? {},
    createdAt: notification.created_at,
    readAt: notification.read_at,
    isRead: Boolean(notification.read_at),
  }
}

export const notificationsService = {
  getNotifications: async ({ unreadOnly = false, page = 1, size = 20 } = {}) => {
    const { data } = await api.get('/notifications', {
      params: { unread_only: unreadOnly, page, size },
    })
    return {
      items: (data.items ?? []).map(adaptNotification),
      total: data.total,
      page: data.page,
      pages: data.pages,
    }
  },

  getUnreadCount: async () => {
    const { data } = await api.get('/notifications/unread-count')
    return data.unread ?? 0
  },

  markRead: async (notificationId) => {
    const { data } = await api.patch(`/notifications/${notificationId}/read`)
    return adaptNotification(data)
  },

  markAllRead: async () => {
    const { data } = await api.patch('/notifications/read-all')
    return data.updated ?? 0
  },
}
