type Notification = {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;
  durationMs?: number;
};

let handler: ((n: Notification) => void) | null = null;
const queued: Notification[] = [];

export function setNotificationHandler(h: (n: Notification) => void) {
  handler = h;
  // flush any queued notifications
  while (queued.length > 0) {
    try {
      const n = queued.shift()!;
      handler(n);
    } catch (e) {
      console.warn('notificationCenter: flush failed', e);
      break;
    }
  }
}

export function clearNotificationHandler() {
  handler = null;
}

export function notify(n: Notification | string) {
  try {
    const payload: Notification = typeof n === 'string' ? { message: n } : n;
    if (handler) {
      handler(payload);
    } else {
      queued.push(payload);
      if (queued.length > 30) queued.shift();
    }
  } catch (e) {
    console.warn('notificationCenter.notify failed', e);
  }
}
