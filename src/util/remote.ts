interface ServerMessage {
  error: string | null;
  message: string;
  id: string;
}

export type KasifRemoteOptions = {
  functions: Record<string, Function>;
  constants: Record<string, any>;
};

type PromisedReturnFunctions<T extends KasifRemoteOptions['functions']> = {
  // @ts-ignore ignore
  [K in keyof T]: (...args: Parameters<T[K]>) => Promise<Awaited<ReturnType<T[K]>>>;
};

type PromisedReturnConstants<T extends KasifRemoteOptions['constants']> = {
  [K in keyof T]: Promise<T[K]>;
};

export class KasifRemote<T extends KasifRemoteOptions> extends EventTarget {
  #socket: WebSocket;
  #resolvers: Map<string, (value: ServerMessage) => void> = new Map();

  constructor(public token: string, public port: number) {
    super();
    this.#socket = new WebSocket(`ws://localhost:${this.port}`);

    this.#socket.addEventListener('message', (event) => {
      const response = JSON.parse(event.data);

      const resolver = this.#resolvers.get(response.id);

      if (resolver) {
        if (response.error) {
          throw new Error(response.error);
        } else {
          resolver(response.message);
        }
        this.#resolvers.delete(response.id);
      }
    });

    this.#socket.addEventListener('open', () => {
      this.dispatchEvent(new CustomEvent('ready'));
    });
  }

  functions = new Proxy({} as PromisedReturnFunctions<T['functions']>, {
    get:
      (_, key: string) =>
      (...args: any[]) =>
        this.#call(key, args),
    set() {
      throw new Error('cannot set function');
    },
  });

  constants = new Proxy({} as PromisedReturnConstants<T['constants']>, {
    get: (_, key: string) => {
      if (key !== '__proto__') {
        return this.#retrieve(key);
      }
    },
    set() {
      throw new Error('cannot set constant');
    },
  });

  #retrieve(name: string) {
    return new Promise<ServerMessage>((resolve) => {
      const id = `${name}-${Date.now()}`;

      const payload = {
        token: this.token,
        action: {
          id,
          name,
          type: 'retrieve',
        },
      };

      this.#socket.send(JSON.stringify(payload));
      this.#resolvers.set(id, resolve);
    });
  }

  #call<K>(name: string, args?: K[]) {
    return new Promise<ServerMessage>((resolve) => {
      const id = `${name}-${Date.now()}`;

      const payload = {
        token: this.token,
        action: {
          id,
          name,
          type: 'call',
          arguments: args || [],
        },
      };

      this.#socket.send(JSON.stringify(payload));
      this.#resolvers.set(id, resolve);
    });
  }
}
