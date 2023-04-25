import { useEffect, useState } from 'react';

import { Slice, SliceUpdate } from '@kasif-apps/cinq';

export function useSlice<T>(slice: Slice<T>): [T, Slice<T>['set']] {
  const [value, setValue] = useState(slice.get());

  const listener = (event: CustomEvent<SliceUpdate<T>>) => {
    setValue.call(slice, event.detail.value);
  };

  useEffect(() => slice.subscribe(listener), []);

  return [value, (...args: Parameters<typeof slice.set>) => slice.set.call(slice, ...args)];
}
