import PocketBase from 'pocketbase';

export interface BackendError {
  response: {
    code: number;
    message: string;
    data: object;
  };
}

export const backend = new PocketBase('http://127.0.0.1:8090');
