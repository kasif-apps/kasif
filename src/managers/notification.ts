import { NotificationProps, showNotification } from '@mantine/notifications';
import { BaseManager } from '@kasif/managers/base';

export class NotificationManager extends BaseManager {
  error(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    showNotification({
      ...options,
      title: title || 'An error occurred.',
      message,
      color: 'red',
    });

    this.dispatchEvent(new CustomEvent('error', { detail: { message, title, options } }));
  }

  warn(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    showNotification({
      ...options,
      title,
      message,
      color: 'orange',
    });

    this.dispatchEvent(new CustomEvent('warn', { detail: { message, title, options } }));
  }

  log(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    showNotification({
      ...options,
      title,
      message,
      color: 'teal',
    });

    this.dispatchEvent(new CustomEvent('log', { detail: { message, title, options } }));
  }
}
