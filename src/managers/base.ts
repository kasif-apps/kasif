import { App } from '@kasif/config/app';

export abstract class BaseManager extends EventTarget {
  identifier!: keyof App;
  constructor(public app: App, public parent?: App) {
    super();
  }
}
