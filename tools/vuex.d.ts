interface DispatchOptions {
  root?: boolean
}
interface Payload {
  type: string
}
interface Dispatch {
  // type 直接是 string，没有进行推导
  (type: string, payload?: any, options?: DispatchOptions): Promise<any>
  <P extends Payload>(
    payloadWithType: P,
    options?: DispatchOptions
  ): Promise<any>
}

interface ActionTree<S, R> {
  [key: string]: Action<S, R>
}

// ActionHandler 和 ActionObject 就不过多讨论了，大体是限制 action 的值
type Action<S, R> = ActionHandler<S, R> | ActionObject<S, R>

interface ModuleTree<R> {
  [key: string]: Module<any, R>
}

interface Module<S, R> {
  // 这里我们简化一下操作，只要开启后就可以嵌套（真实情况还可以有很多特例）
  namespaced?: boolean
  state?: S | (() => S)
  // ...
  // modules 是可以嵌套的
  modules?: ModuleTree<R>
}

interface StoreOptions<S> {
  // 可以看到 S 为 state 的值
  state?: S | (() => S)
  // ...
  actions?: ActionTree<S, S>
  modules?: ModuleTree<S>
  // ..
}

export declare class Store<S> {
  // 这里只讲类型，不讲代码实现
  constructor(options: StoreOptions<S>) {}
  dispatch: Dispatch
  // ...
}

// 测试
const store = new Store({
  actions: {
    test() {
      console.log('test')
    }
  }
})

store.dispatch()
