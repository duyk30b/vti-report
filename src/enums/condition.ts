export type Condition<T> = Partial<{
  [key in keyof T]: T[key];
}>;

export function Key<T>(key: keyof T) {
  return key;
}
