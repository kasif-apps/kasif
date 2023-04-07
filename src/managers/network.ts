import { createSlice } from '@kasif-apps/cinq';
import { BaseManager } from '@kasif/managers/base';
import { authorized, trackable, tracker } from '@kasif/util/decorators';

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
  store = createSlice<NetworkStatus>(this.getConnection(), { key: 'network-store' });

  private getConnectionInstance() {
    const _navigator = navigator as any;
    const connection: any =
      _navigator.connection || _navigator.mozConnection || _navigator.webkitConnection;

    return connection;
  }

  @trackable
  @authorized(['reinit_network_manager'])
  init() {
    window.addEventListener('online', () => {
      this.store.set({ ...this.getConnection(), online: true });
      this.dispatchEvent(new CustomEvent('online'));
      this.app.notificationManager.log('Network stasus is online', 'Network Status Changed');
    });
    window.addEventListener('offline', () => {
      this.store.set({ ...this.getConnection(), online: false });
      this.dispatchEvent(new CustomEvent('offline'));
      this.app.notificationManager.log('Network stasus is offline', 'Network Status Changed');
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

  @trackable
  @authorized(['read_connection_data'])
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

  @trackable
  @authorized(['kill_network_manager'])
  kill() {
    const connection = this.getConnectionInstance();

    if (connection) {
      connection.removeEventListener('change', this.handleConnectionChange);
    }
  }
}
