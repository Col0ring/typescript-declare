// 工具函数
// 因为我们传的是 keyof ，但是我们只要 string 类型，所以可以直接 & 只取 string
type Prefix<P, K> = `${P & string}/${K & string}`

// 获取有前缀的子模块
// 因为我们的选项都是可选的，所以需要再加两个判断，传了对象，并且对象有索引
type GetPrefixSubModules<P, SM> = SM extends ModuleTree
  ? keyof SM extends string
    ? // 这里就是开始递归了，子模块作为 modules 传入
      Prefix<P, GetModulesType<SM>>
    : never
  : never
// 获取没有前缀的子模块
type GetSubModules<SM> = SM extends ModuleTree
  ? keyof SM extends string
    ? // 开始递归
      GetModulesType<SM>
    : never
  : never

// 获取有前缀的 actions 的 keys
// 因为我们的选项都是可选的，所以需要再加两个判断，传了对象，并且对象有索引
type GetPrefixActionKeys<P, A> = A extends ActionTree
  ? keyof A extends string
    ? Prefix<P, keyof A>
    : never
  : never
// 获取没有前缀的 actions 的 keys
type GetActionKeys<A> = A extends ActionTree
  ? keyof A extends string
    ? keyof A
    : never
  : never

// 简化内部操作，就把 Action 看作普通函数
type Action = () => void
interface ActionTree {
  [key: string]: Action
}
interface ModuleTree {
  [key: string]: Module
}

// 这边不要写 extends，会限制相关推断类型的，我们在后面单独判断
interface Module<N = boolean, A = ActionTree, M = ModuleTree> {
  // 这里我们简化一下操作，只要开启后就可以嵌套（真实情况还可以有很多特例）
  namespaced?: N
  actions?: A
  // modules 是可以嵌套的
  modules?: M
}

// 遍历 ModuleTree
type GetModulesType<MS extends ModuleTree> = {
  // 这里我们把里面的某个索引拿到（当前缀），再传入到单独获取类型的工具中
  [K in keyof MS]: GetModuleType<K, MS[K]>
}[keyof MS] // 遍历到所有的 value

// 递归获取 Module 的所有相关联的 type
type GetModuleType<P, M> = M extends Module<infer N, infer A, infer SubModules> // N 为 namespaced 的值，A 为模块的 actions 的值（ActionTree），SubModules 为 modules 的值
  ? /* 
  N extends true，因为 N 为 boolean，所以 N 其实是 true 和 false 的联合类型，所以两边都会触发，但我们这个的 N 因为受到了限制，只会是 true 或者 false
  */
    N extends true
    ? // 这里如果 namespaced 为 true 就返回有前缀的 actions 和所有子 modules 的 actions，否则就不加前缀
      GetPrefixActionKeys<P, A> | GetPrefixSubModules<P, SubModules>
    : GetActionKeys<A> | GetSubModules<SubModules>
  : never

interface StoreOptions<A extends ActionTree, M extends ModuleTree> {
  actions?: A
  modules?: M
}

interface DispatchOptions {
  root?: boolean
}
interface Payload<A> {
  type: A
}
interface Dispatch<T> {
  // type 直接是 string，没有进行推导
  (type: T, payload?: any, options?: DispatchOptions): Promise<any>
  <P extends Payload<T>>(
    payloadWithType: P,
    options?: DispatchOptions
  ): Promise<any>
}

export declare class Store<A extends ActionTree, M extends ModuleTree> {
  // 这里只讲类型，不讲代码实现
  constructor(options: StoreOptions<A, M>)
  dispatch: Dispatch<keyof A | GetModulesType<M>>
  // ...
}

// test
const store = new Store({
  actions: {
    root() {}
  },
  modules: {
    cart: {
      namespaced: true,
      actions: {
        add() {},
        remove() {}
      }
    },
    user: {
      namespaced: true,
      actions: {
        login() {}
      },
      modules: {
        admin: {
          namespaced: true,
          actions: {
            adminLogin() {}
          },
          modules: {
            goods: {
              // namespaced 为 false
              namespaced: false,
              actions: {
                add() {}
              }
            }
          }
        },
        editor: {
          namespaced: true,
          actions: {
            editorLogin() {}
          },
          modules: {
            post: {
              // 不写 namespaced
              actions: {
                create() {}
              }
            }
          }
        }
      }
    }
  }
})

store.dispatch('')
