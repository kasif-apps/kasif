import React from 'react';

import { Group, Text, TextProps } from '@mantine/core';
import { NotificationProps, showNotification } from '@mantine/notifications';

import { BaseManager } from '@kasif/managers/base';
import { authorized, trackable, tracker } from '@kasif/util/decorators';

import { IconAlertTriangle, IconCheck, IconInfoCircle, IconX } from '@tabler/icons';

import { createVectorSlice } from '@kasif-apps/cinq';

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
      React.createElement(Text as React.FC<TextProps>, { color: 'dimmed', size: 'xs' }, [
        source.name,
      ]),
    ]);
  }

  getLogLevel() {
    const controller =
      this.app.settingsManager.getSettingController<keyof typeof Log>('log-level')!;
    const logLevel = controller.instance.get().value;

    return Log[logLevel];
  }

  @trackable
  @authorized(['show_notifications'])
  error(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    const source = { id: this.app.id, name: this.app.name };
    const id = crypto.randomUUID();

    if (this.getLogLevel() >= Log.ERROR) {
      showNotification({
        ...options,
        title: this.createMessageTitle(title || 'Error', source),
        icon: React.createElement(IconX, { size: 20 }),
        message,
        color: 'red',
        id,
      });
    }

    this.logs.unshift({ message, title, type: 'error', source, time: new Date() });
    this.dispatchEvent(new CustomEvent('error', { detail: { message, title, options } }));
  }

  @trackable
  @authorized(['show_notifications'])
  warn(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    const source = { id: this.app.id, name: this.app.name };
    const id = crypto.randomUUID();

    if (this.getLogLevel() >= Log.WARNING) {
      showNotification({
        ...options,
        title: this.createMessageTitle(title || 'Warning', source),
        message,
        icon: React.createElement(IconAlertTriangle, { size: 20 }),
        color: 'orange',
        id,
      });
    }

    this.logs.unshift({ message, title, type: 'warn', source, time: new Date() });
    this.dispatchEvent(new CustomEvent('warn', { detail: { message, title, options } }));
  }

  @trackable
  @authorized(['show_notifications'])
  success(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    const source = { id: this.app.id, name: this.app.name };
    const id = crypto.randomUUID();

    if (this.getLogLevel() >= Log.SUCCESS) {
      showNotification({
        ...options,
        title: this.createMessageTitle(title || 'Success', source),
        message,
        icon: React.createElement(IconCheck, { size: 20 }),
        color: 'green',
        id,
      });
    }

    this.logs.unshift({ message, title, type: 'success', source, time: new Date() });
    this.dispatchEvent(new CustomEvent('success', { detail: { message, title, options } }));
  }

  @trackable
  @authorized(['show_notifications'])
  log(
    message: string,
    title?: string,
    options?: Omit<Omit<Omit<NotificationProps, 'title'>, 'message'>, 'color'>
  ) {
    const source = { id: this.app.id, name: this.app.name };
    const id = crypto.randomUUID();

    if (this.getLogLevel() >= Log.LOG) {
      showNotification({
        ...options,
        title: this.createMessageTitle(title || 'Info', source),
        message,
        icon: React.createElement(IconInfoCircle, { size: 20 }),
        color: 'blue',
        id,
      });
    }

    this.logs.unshift({ message, title, type: 'log', source, time: new Date() });
    this.dispatchEvent(new CustomEvent('log', { detail: { message, title, options } }));
  }
}
