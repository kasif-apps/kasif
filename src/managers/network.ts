import { createSlice } from '@kasif-apps/cinq';
import { BaseManager } from '@kasif/managers/base';

interface NetworkStatus {
  downlink?: number;
  downlinkMax?: number;
  effectiveType?: 'slow-2g' | '2g' | '3g' | '4g';
  rtt?: number;
  saveData?: boolean;
  type?: 'bluetooth' | 'cellular' | 'ethernet' | 'wifi' | 'wimax' | 'none' | 'other' | 'unknown';
  online: boolean;
}

export class NetworkManager extends BaseManager {
  store = createSlice<NetworkStatus>(this.getConnection(), { key: 'network-store' });

  private getConnectionInstance() {
    const _navigator = navigator as any;
    const connection: any =
      _navigator.connection || _navigator.mozConnection || _navigator.webkitConnection;

    return connection;
  }

  constructor() {
    super();
    window.addEventListener('online', () => {
      this.store.set({ ...this.getConnection(), online: true });
      this.dispatchEvent(new CustomEvent('online'));
    });
    window.addEventListener('offline', () => {
      this.store.set({ ...this.getConnection(), online: false });
      this.dispatchEvent(new CustomEvent('offline'));
    });

    const connection = this.getConnectionInstance();
    if (typeof connection !== 'undefined') {
      connection.addEventListener('change', this.handleConnectionChange);
    }
  }

  handleConnectionChange() {
    this.store.set(this.getConnection());
    this.dispatchEvent(new CustomEvent('change'));
  }

  getConnection(): NetworkStatus {
    const connection = this.getConnectionInstance();

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

  kill() {
    const connection = this.getConnectionInstance();

    if (connection) {
      connection.removeEventListener('change', this.handleConnectionChange);
    }
  }
}
