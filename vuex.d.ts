type GetMutations<Module> = Module extends { mutations: infer M } ? M : never
// 因为我们传的是 keyof ，但是我们只要 string 类型，所以可以直接 & 只取 string
type AddPrefix<Prefix, Keys> = `${Prefix & string}/${Keys & string}`
type GetSubModuleKeys<Module, Key> = Module extends {
  modules: infer SubModules
}
  ? AddPrefix<Key, GetModulesMutationKeys<SubModules>>
  : never
// 下面开始递归
type GetModuleMutationKeys<Module, Key> =
  | AddPrefix<Key, keyof GetMutations<Module>>
  | GetSubModuleKeys<Module, Key>
type GetModulesMutationKeys<Modules> = {
  [K in keyof Modules]: GetModuleMutationKeys<Modules[K], K>
}[keyof Modules]
type Action<Mutations, Modules> =
  | keyof Mutations
  | GetModulesMutationKeys<Modules>
type Store<Mutations, Modules> = {
  dispatch(action: Action<Mutations, Modules>): void
}
type VuexOptions<Mutations, Modules> = {
  mutations: Mutations
  modules: Modules
}
export declare function Vuex<Mutations, Modules>(
  options: VuexOptions<Mutations, Modules>
): Store<Mutations, Modules>

// test
const store = Vuex({
  mutations: {
    root() {}
  },
  modules: {
    cart: {
      mutations: {
        add() {},
        remove() {}
      }
    },
    user: {
      mutations: {
        login() {}
      },
      modules: {
        admin: {
          mutations: {
            login() {}
          }
        }
      }
    }
  }
})
store.dispatch('cart/remove')
