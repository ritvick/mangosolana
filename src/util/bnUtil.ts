import BN from 'bn.js';

type ObjectWithBNKeys<T> = {
    [K in keyof T]: T[K] extends BN ? string | number : T[K];
  };
  
export function convertBNKeysToNative<T extends Record<string, unknown>>(obj: T): ObjectWithBNKeys<T> {
    const newObj = {} as ObjectWithBNKeys<T>;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (value instanceof BN) {
          // Convert the BN.js object to a native number or string
          newObj[key as keyof T] = value.toString() as ObjectWithBNKeys<T>[keyof T];
          // Type assertion here ----^
        } else {
          // Keep the original value
          newObj[key as keyof T] = value as ObjectWithBNKeys<T>[keyof T];
        }
      }
    }
    return newObj;
}
