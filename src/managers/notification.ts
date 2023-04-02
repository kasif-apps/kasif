import { NotificationProps, showNotification } from '@mantine/notifications';
import { BaseManager } from '@kasif/managers/base';
import { IconAlertTriangle, IconCheck, IconInfoCircle, IconX } from '@tabler/icons';
import React from 'react';
import { createVectorSlice } from '@kasif-apps/cinq';
import { Group, Text } from '@mantine/core';
import { trackable, tracker } from '@kasif/util/misc';

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

export const Log = {
  ERROR: 0,
  WARNING: 1,
  SUCCESS: 2,
  LOG: 3,
} as const;

@tracker('notificationManager')
export class NotificationManager extends BaseManager {
  logs = createVectorSlice<NotificationLog[]>([], { key: 'notification-logs' });

  createMessageTitle(title: string, source: NotificationLog['source']) {
    return React.createElement(Group, { position: 'apart', sx: { display: 'flex' } }, [
      React.createElement('span', {}, title),
      // @ts-ignore
      React.createElement(Text, { color: 'dimmed', size: 'xs' }, [source.name]),
    ]);
  }

  getLogLevel() {
    const controller =
      this.app.settingsManager.getSettingController<keyof typeof Log>('log-level')!;
    const logLevel = controller.instance.get().value;

    return Log[logLevel];
  }

  @trackable
  error(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    const source = { id: this.app.id, name: this.app.name };

    if (this.getLogLevel() >= Log.ERROR) {
      showNotification({
        ...options,
        title: this.createMessageTitle(title || 'Error', source),
        icon: React.createElement(IconX, { size: 20 }),
        message,
        color: 'red',
      });
    }

    this.logs.push({ message, title, type: 'error', source, time: new Date() });
    this.dispatchEvent(new CustomEvent('error', { detail: { message, title, options } }));
  }

  @trackable
  warn(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    const source = { id: this.app.id, name: this.app.name };

    if (this.getLogLevel() >= Log.WARNING) {
      showNotification({
        ...options,
        title: this.createMessageTitle(title || 'Warning', source),
        message,
        icon: React.createElement(IconAlertTriangle, { size: 20 }),
        color: 'orange',
      });
    }

    this.logs.push({ message, title, type: 'warn', source, time: new Date() });
    this.dispatchEvent(new CustomEvent('warn', { detail: { message, title, options } }));
  }

  @trackable
  success(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    const source = { id: this.app.id, name: this.app.name };

    if (this.getLogLevel() >= Log.SUCCESS) {
      showNotification({
        ...options,
        title: this.createMessageTitle(title || 'Success', source),
        message,
        icon: React.createElement(IconCheck, { size: 20 }),
        color: 'green',
      });
    }

    this.logs.push({ message, title, type: 'success', source, time: new Date() });
    this.dispatchEvent(new CustomEvent('success', { detail: { message, title, options } }));
  }

  @trackable
  log(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    const source = { id: this.app.id, name: this.app.name };

    if (this.getLogLevel() >= Log.LOG) {
      showNotification({
        ...options,
        title: this.createMessageTitle(title || 'Info', source),
        message,
        icon: React.createElement(IconInfoCircle, { size: 20 }),
        color: 'blue',
      });
    }

    this.logs.push({ message, title, type: 'log', source, time: new Date() });
    this.dispatchEvent(new CustomEvent('log', { detail: { message, title, options } }));
  }
}
