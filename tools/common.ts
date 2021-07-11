export type Key = string | number | symbol

export type Keys<T> = keyof T

export type Values<Modules> = {
  [K in keyof Modules]: Modules[K]
}[keyof Modules]
