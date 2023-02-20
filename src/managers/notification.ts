import { NotificationProps, showNotification } from '@mantine/notifications';
import { BaseManager } from '@kasif/managers/base';
import { IconAlertTriangle, IconCheck, IconX } from '@tabler/icons';
import React from 'react';
import { createVectorSlice } from '@kasif-apps/cinq';

export type NotificationType = 'error' | 'warn' | 'success' | 'log';

export interface NotificationLog {
  message: string;
  title?: string;
  type: NotificationType;
}

export class NotificationManager extends BaseManager {
  logs = createVectorSlice<NotificationLog[]>([], { key: 'notification-logs' });

  error(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    showNotification({
      ...options,
      title: title || 'An error occurred.',
      icon: React.createElement(IconX, { size: 20 }),
      message,
      color: 'red',
    });

    this.logs.push({ message, title, type: 'error' });
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
      icon: React.createElement(IconAlertTriangle, { size: 20 }),
      color: 'orange',
    });

    this.logs.push({ message, title, type: 'warn' });
    this.dispatchEvent(new CustomEvent('warn', { detail: { message, title, options } }));
  }

  success(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    showNotification({
      ...options,
      title,
      message,
      icon: React.createElement(IconCheck, { size: 20 }),
      color: 'green',
    });

    this.logs.push({ message, title, type: 'success' });
    this.dispatchEvent(new CustomEvent('success', { detail: { message, title, options } }));
  }

  log(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    this.logs.push({ message, title, type: 'log' });
    this.dispatchEvent(new CustomEvent('log', { detail: { message, title, options } }));
  }
}
