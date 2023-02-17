import * as React from 'react';
import { Slice, SliceUpdate } from '@kasif-apps/cinq';

export function useSlice<T>(slice: Slice<T>): [T, Slice<T>['set']] {
  const [value, setValue] = React.useState(slice.get());

  const listener = (event: CustomEvent<SliceUpdate<T>>) => {
    setValue(event.detail.value);
  };

  React.useEffect(() => slice.subscribe(listener), []);

  return [value, slice.set];
}
