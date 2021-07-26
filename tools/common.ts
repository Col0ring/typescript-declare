export type Key = string | number | symbol

export type Keys<T> = keyof T

export type Values<Modules> = {
  [K in keyof Modules]: Modules[K]
}[keyof Modules]

// 如果传对象属性全部变为可选
export type ObjectKeysPartial<T> = T extends (...args: any[]) => any
  ? T
  : Partial<T>

// 如果传函数就把函数的返回对象的属性全部变为可选
export type FunctionReturnPartial<T> = T extends (...args: infer P) => infer R
  ? (...args: P) => ObjectKeysPartial<R>
  : T

// 因为 setState 可以传对象和函数，我们这里要判断一下，先一层判断修改函数，然而二层判断修改对象
export type setMergeStateParamsTool<T> = {
  [K in keyof T]: ObjectKeysPartial<FunctionReturnPartial<T[K]>>
}
// 修改参数和返回值
export type SetMergeStateTool<T> = T extends (...args: infer P) => infer R
  ? (...args: setMergeStateParamsTool<P>) => R
  : T
