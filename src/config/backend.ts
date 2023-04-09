import PocketBase from 'pocketbase';

export interface BackendError {
  response: {
    code: number;
    message: string;
    data: object;
  };
}

export const backend = new PocketBase(import.meta.env.VITE_REACT_API_URL);
