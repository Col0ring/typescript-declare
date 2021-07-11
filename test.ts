interface Foo<T> {
  value: T
  keys: (keyof T)[]
}

const foo: Foo<{ a: number; b: string }> = {
  value: {
    a: 1,
    b: '1'
  },
  keys: ['a', 'b']
}
