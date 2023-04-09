import { App, kasif } from '@kasif/config/app';
import { BaseManager } from '@kasif/managers/base';
import { PermissionType } from '@kasif/config/permission';

export function trackable(
  target: BaseManager,
  propertyKey: string,
  _descriptor: PropertyDescriptor
) {
  const originalValue = _descriptor.value;
  const descriptor = _descriptor;

  descriptor.value = function descValue(...args: any[]) {
    const identifier = target.constructor.prototype.identifier as keyof App;
    const instance = this as BaseManager;
    const key = propertyKey as keyof BaseManager;

    if (instance.parent && identifier) {
      const parent = instance.parent[identifier] as BaseManager;
      const targetMethod = parent[key];

      if (typeof targetMethod === 'function') {
        if (parent && parent.app) {
          parent.app.id = instance.app.id;
          parent.app.name = instance.app.name;
          parent.app.version = instance.app.version;
        }

        // @ts-expect-error
        const result = targetMethod.apply(instance.parent[identifier], args);

        if (parent && parent.app) {
          parent.app.id = kasif.id;
          parent.app.name = kasif.name;
          parent.app.version = kasif.version;
        }
        return result;
      }
    }

    return originalValue.apply(this, args);
  };
}

export function tracker(identifier: keyof App) {
  return function t(_constructor: Function) {
    const constructor = _constructor;
    constructor.prototype.identifier = identifier;
  };
}

export function authorized(permissions: PermissionType[]) {
  return function p(_target: BaseManager, _propertyKey: string, _descriptor: PropertyDescriptor) {
    const originalValue = _descriptor.value;
    const descriptor = _descriptor;

    descriptor.value = function descValue(...args: any[]) {
      const instance = this as BaseManager;
      const missingPermissions = instance.app.permissionManager.getMissingPermissions(permissions);

      if (missingPermissions.length === 0) {
        return originalValue.apply(instance, args);
      }

      instance.app.permissionManager.prompt(permissions).then((granted) => {
        if (granted) {
          originalValue.apply(instance, args);
        }
      });
    };
  };
}
