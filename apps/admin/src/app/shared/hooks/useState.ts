import { useLocalObservable } from 'mobx-react-lite'

export const useState = <T extends Record<string, any>>(rawState: T) => {
  return useLocalObservable(() => rawState)
}
