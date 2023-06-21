export type RemoteModuleFunction = (...args: unknown[]) => Promise<unknown>;

export interface Message {
  token: string;
  action: {
    id: string;
    type: Request['action']['type'] | Response['action']['type'];
  };
}

export interface AuthenticationRequest extends Message {
  action: {
    id: string;
    type: 'authentication-request';
    name: string;
    passphrase: string;
  };
}

export interface AuthenticationResponse extends Message {
  action: {
    id: string;
    type: 'authentication-response';
    token: string;
    module: string;
    throws: string | undefined;
  };
}

export interface FunctionCallRequest extends Message {
  action: {
    id: string;
    type: 'function-call-request';
    name: string;
    arguments: unknown[];
  };
}

export interface FunctionCallResponse extends Message {
  action: {
    id: string;
    type: 'function-call-response';
    returns: unknown;
    throws: string | undefined;
  };
}

export type Request = AuthenticationRequest | FunctionCallRequest;
export type Response = AuthenticationResponse | FunctionCallResponse;

export class Deferred<T, E extends Error> {
  promise: Promise<T>;
  resolve!: (value: T | PromiseLike<T>) => void;
  reject!: (error: E) => void;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}

export interface RPCOptions {
  port: number;
  name: string;
  passphrase: string;
}

export class RPC extends EventTarget {
  #token = '';
  #socket: WebSocket;
  #mod: Record<string, RemoteModuleFunction> | undefined;
  #references = new Map<string, Deferred<unknown, Error>>();
  url?: string;

  constructor(public options: RPCOptions) {
    super();
    this.#socket = new WebSocket(`ws://localhost:${this.options.port}`);

    this.#socket.addEventListener('message', event => this.#handleMessage(JSON.parse(event.data)));

    this.#socket.addEventListener('open', () => {
      const payload: AuthenticationRequest = {
        token: this.#token,
        action: {
          id: 'authentication-request',
          type: 'authentication-request',
          name: this.options.name,
          passphrase: this.options.passphrase,
        },
      };
      this.#send(payload);
    });
  }

  call = new Proxy({} as Record<string, RemoteModuleFunction>, {
    get:
      (_target, key: string) =>
      async (...args: unknown[]) => {
        const id = crypto.randomUUID();
        const deferred = new Deferred();
        const payload: FunctionCallRequest = {
          token: this.#token,
          action: {
            id,
            type: 'function-call-request',
            name: key,
            arguments: args,
          },
        };
        this.#references.set(id, deferred);
        this.#send(payload);

        return deferred.promise;
      },
  });

  #handleMessage(message: Message) {
    switch (message.action.type) {
      case 'authentication-response':
        this.#handleAuthenticationResponse(message as AuthenticationResponse);
        break;
      case 'function-call-response':
        this.#handleFunctionCallRespone(message as FunctionCallResponse);
        break;
      case 'function-call-request': {
        const result = this.#handleFunctionCallRequest(message as FunctionCallRequest);
        const payload: FunctionCallResponse = {
          token: this.#token,
          action: {
            id: message.action.id,
            type: 'function-call-response',
            ...result,
          },
        };
        this.#send(payload);
        break;
      }
    }
  }

  #handleFunctionCallRequest(
    message: FunctionCallRequest
  ): Omit<Omit<FunctionCallResponse['action'], 'id'>, 'type'> {
    if (!this.#mod) {
      return {
        returns: undefined,
        throws: `module '${this.url}' has not beed loaded`,
      };
    }

    const func = this.#mod[message.action.name];

    if (!func) {
      return {
        returns: undefined,
        throws: `no function named '${message.action.name}' in module '${this.url}'`,
      };
    }

    try {
      const result = func.call(window, message.action.arguments);

      return {
        returns: result,
        throws: undefined,
      };
    } catch (error) {
      return {
        returns: undefined,
        throws: String(error),
      };
    }
  }

  #handleFunctionCallRespone(response: FunctionCallResponse) {
    if (response.action.throws) {
      throw new Error(response.action.throws);
    }

    const deferred = this.#references.get(response.action.id);

    if (!deferred) {
      return;
    }

    deferred.resolve(response.action.returns);
  }

  #handleAuthenticationResponse(response: AuthenticationResponse) {
    if (response.action.throws) {
      throw new Error(response.action.throws);
    }

    this.#token = response.action.token;

    this.url = response.action.module;
    import(response.action.module).then(mod => {
      this.#mod = mod;

      this.dispatchEvent(new CustomEvent('ready'));
    });
  }

  #send(message: unknown) {
    this.#socket.send(JSON.stringify(message));
  }
}
