import { NotificationProps, showNotification } from '@mantine/notifications';
import { BaseManager } from '@kasif/managers/base';
import { IconAlertTriangle, IconCheck, IconX } from '@tabler/icons';
import React from 'react';
import { createVectorSlice } from '@kasif-apps/cinq';
import { Group, Text } from '@mantine/core';
import { app } from '@kasif/config/app';

export type NotificationType = 'error' | 'warn' | 'success' | 'log';

export interface NotificationLog {
  message: string;
  title?: string;
  type: NotificationType;
  source: {
    id: string;
    name: string;
  };
  time: Date;
}

export class NotificationManager extends BaseManager {
  logs = createVectorSlice<NotificationLog[]>([], { key: 'notification-logs' });

  createMessageTitle(title: string, source: NotificationLog['source']) {
    return React.createElement(Group, { position: 'apart', sx: { display: 'flex' } }, [
      React.createElement('span', {}, title),
      // @ts-ignore
      React.createElement(Text, { color: 'dimmed', size: 'xs' }, [source.name]),
    ]);
  }

  error(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    const source = { id: app.id, name: app.name };

    showNotification({
      ...options,
      title: this.createMessageTitle(title || 'Error', source),
      icon: React.createElement(IconX, { size: 20 }),
      message: `${message}\nhi`,
      color: 'red',
    });

    this.logs.push({ message, title, type: 'error', source, time: new Date() });
    this.dispatchEvent(new CustomEvent('error', { detail: { message, title, options } }));
  }

  warn(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    const source = { id: app.id, name: app.name };

    showNotification({
      ...options,
      title: this.createMessageTitle(title || 'Warning', source),
      message,
      icon: React.createElement(IconAlertTriangle, { size: 20 }),
      color: 'orange',
    });

    this.logs.push({ message, title, type: 'warn', source, time: new Date() });
    this.dispatchEvent(new CustomEvent('warn', { detail: { message, title, options } }));
  }

  success(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    const source = { id: app.id, name: app.name };

    showNotification({
      ...options,
      title: this.createMessageTitle(title || 'Success', source),
      message,
      icon: React.createElement(IconCheck, { size: 20 }),
      color: 'green',
    });

    this.logs.push({ message, title, type: 'success', source, time: new Date() });
    this.dispatchEvent(new CustomEvent('success', { detail: { message, title, options } }));
  }

  log(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    const source = { id: app.id, name: app.name };

    this.logs.push({ message, title, type: 'log', source, time: new Date() });
    this.dispatchEvent(new CustomEvent('log', { detail: { message, title, options } }));
  }
}
