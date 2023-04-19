import { PluginImport } from '@kasif/managers/plugin';

interface ClientResponse {
  token: string;
  action: ClientAction;
}

type ClientAction = CallAction | ResponseAction;

interface CallAction {
  id: string;
  type: 'call';
  name: string;
  arguments: unknown[];
}

interface ResponseAction {
  id: string;
  type: 'response';
  error: string | null;
  message: string;
}

type ClientMessage = CallResponse | ResponseResponse | ConnectResponse | RetrieveResponse;

interface CallResponse {
  type: 'call';
  id: string;
  error: string | null;
  message: unknown;
}

interface ResponseResponse {
  id: string;
  type: 'response';
  name: string;
  arguments: unknown[];
}

interface ConnectResponse {
  id: string;
  type: 'connect';
  error: string | null;
  message: string;
}

interface RetrieveResponse {
  type: 'retrieve';
  id: string;
  error: string | null;
  message: unknown;
}

export class KasifRemote extends EventTarget {
  #token = '';
  #socket: WebSocket;

  #resolvers: Map<string, (value: unknown) => void> = new Map();
  #mod: PluginImport['file'] | undefined;

  constructor(public port: number, public name: string) {
    super();
    this.#socket = new WebSocket(`ws://localhost:${this.port}`);

    this.#socket.addEventListener('message', (event) => this.handleMessage(event.data));

    this.#socket.addEventListener('open', () => {
      const payload = {
        token: this.#token,
        action: {
          id: 'connect',
          type: 'connect',
          name: this.name,
        },
      };
      this.#socket.send(JSON.stringify(payload));
    });
  }

  handleMessage(data: string) {
    const message: ClientMessage = JSON.parse(data);

    switch (message.type) {
      case 'connect':
        // server responds with credentials
        this.handleConnectAction(message);
        break;
      case 'call':
        // server responds with function return
        this.handleCallAction(message);
        break;
      case 'retrieve':
        // server responds with constant value
        break;
      case 'response':
        // server requests a function's return value
        this.handleResponseAction(message).then((response) =>
          this.#socket.send(JSON.stringify(response))
        );
        break;
    }
  }

  setModule(mod: PluginImport['file'] | undefined) {
    this.#mod = mod;
  }

  handleConnectAction(response: ConnectResponse) {
    this.#token = response.message;
    this.dispatchEvent(new CustomEvent('ready'));
  }

  handleCallAction(response: CallResponse) {
    const resolver = this.#resolvers.get(response.id);

    if (resolver) {
      if (response.error) {
        throw new Error(response.error);
      }

      resolver(response.message);
    }
  }

  async handleResponseAction(response: ResponseResponse): Promise<ClientResponse> {
    if (!this.#mod) {
      return this.createErrorResponse({ id: response.id, type: 'response' }, 'no module found');
    }

    if (!this.#mod[response.name]) {
      return this.createErrorResponse(
        { id: response.id, type: 'response' },
        `no function named ${response.name} found`
      );
    }

    try {
      const result = await this.#mod[response.name].call(window, response.arguments);
      return this.createHealthyResponse({ id: response.id, type: 'response' }, result);
    } catch (error) {
      return this.createErrorResponse({ id: response.id, type: 'response' }, String(error));
    }
  }

  // deno-lint-ignore ban-types
  functions = new Proxy({} as Record<string, Function>, {
    get:
      (_, key: string) =>
      (...args: unknown[]) =>
        new Promise<unknown>((resolve) => {
          const payload = this.createCallPayload(key, args || []);

          this.#resolvers.set(payload.action.id, resolve);
          this.#socket.send(JSON.stringify(payload));
        }),
    set() {
      throw new Error('cannot set function');
    },
  });

  createCallPayload(name: string, ...args: unknown[]): ClientResponse {
    return {
      token: this.#token,
      action: {
        type: 'call',
        id: crypto.randomUUID(),
        name,
        arguments: args,
      },
    };
  }

  createHealthyResponse(
    action: Pick<ClientAction, 'id' | 'type'>,
    message: unknown
  ): ClientResponse {
    return {
      token: this.#token,
      action: {
        id: action.id,
        type: action.type,
        error: null,
        message,
      },
    } as ClientResponse;
  }

  createErrorResponse(action: Pick<ClientAction, 'id' | 'type'>, error: string): ClientResponse {
    return {
      token: this.#token,
      action: {
        id: action.id,
        type: action.type,
        error,
        message: error,
      },
    } as ClientResponse;
  }
}
