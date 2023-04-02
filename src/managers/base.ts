import { App } from '@kasif/config/app';

export class BaseManager extends EventTarget {
  parent?: App;
  constructor(public app: App, parent?: App) {
    super();

    this.parent = parent;
  }
}
