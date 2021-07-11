export type IsEmptyType<T> = number extends T
  ? T extends {}
    ? keyof T extends never
      ? true
      : false
    : false
  : false

// test
type A = IsEmptyType<string> // false
type B = IsEmptyType<{ a: 3 }> // false
type C = IsEmptyType<{}> // true
type D = IsEmptyType<any> // false
type E = IsEmptyType<object> // false
type F = IsEmptyType<Object> // false
