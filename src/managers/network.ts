import { App } from '@kasif/config/app';
import { BaseManager } from '@kasif/managers/base';
import { authorized, trackable, tracker } from '@kasif/util/decorators';

import { createRecordSlice } from '@kasif-apps/cinq';

interface NetworkStatus {
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  rtt?: number;
  saveData?: boolean;
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'wifi' | 'wimax' | 'none' | 'other' | 'unknown';
  online: boolean;
}

@tracker('networkManager')
export class NetworkManager extends BaseManager {
  store = createRecordSlice<NetworkStatus>(this.#getConnection(), { key: 'network-store' });

  constructor(app: App, parent?: App) {
    super(app, parent);

    this.store.setKey('online', navigator.onLine);
    window.addEventListener('online', this.#handleOnline.bind(this));
    window.addEventListener('offline', this.#handleOffline.bind(this));
  }

  #getConnectionInstance() {
    const _navigator = navigator as any;
    const connection: any =
      _navigator.connection || _navigator.mozConnection || _navigator.webkitConnection;

    return connection;
  }

  @trackable
  @authorized(['reinit_network_manager'])
  init() {
    const connection = this.#getConnectionInstance();
    if (typeof connection !== 'undefined') {
      connection.addEventListener('change', this.#handleConnectionChange.bind(this));
    }
  }

  #handleConnectionChange() {
    this.store.set(this.getConnection());
    this.dispatchEvent(new CustomEvent('change'));
  }

  #handleOnline() {
    this.store.set({ ...this.#getConnection(), online: true });
    this.dispatchEvent(new CustomEvent('online'));
  }

  #handleOffline() {
    this.store.set({ ...this.#getConnection(), online: false });
    this.dispatchEvent(new CustomEvent('offline'));
  }

  @trackable
  @authorized(['read_connection_data'])
  getConnection(): NetworkStatus {
    return this.#getConnection();
  }

  #getConnection(): NetworkStatus {
    const connection = this.#getConnectionInstance();

    if (!connection) {
      return {} as NetworkStatus;
    }

    return {
      downlink: connection?.downlink,
      downlinkMax: connection?.downlinkMax,
      effectiveType: connection?.effectiveType,
      rtt: connection?.rtt,
      saveData: connection?.saveData,
      type: connection?.type,
      online: navigator.onLine,
    };
  }

  @trackable
  @authorized(['kill_network_manager'])
  kill() {
    const connection = this.#getConnectionInstance();

    if (connection) {
      connection.removeEventListener('change', this.#handleConnectionChange);
    }

    window.removeEventListener('online', this.#handleOnline);
    window.removeEventListener('offline', this.#handleOffline);
  }
}
