// utility types
type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`
type AllKeysDotSeparated<T> = (
  T extends object
    ?
        | {
            [K in keyof T]: `${string & K}${DotPrefix<
              AllKeysDotSeparated<T[K]>
            >}`
          }[keyof T]
        | {
            [K in keyof T]: K
          }[keyof T]
    : ''
) extends infer D
  ? Extract<D, string>
  : never
type Merge<A, B> = { [K in keyof (A | B)]: K extends keyof B ? B[K] : A[K] }
type KeyValueObj = { [K: string]: any }

// type for body of dispatched custom event on state change
export type CutDetail = {
  meatCut: string
  value: string
}

// business types
export type Ref<M> = { [K in keyof M]: any }
export type Butch<M> = Merge<Ref<M>, M>
export type MeatCut<M> = AllKeysDotSeparated<M>
export type ButcherConfig = {
  __config: {
    name: string
    station: any
  }
}
export type Butcher<M> = Butch<M> & ButcherConfig
export type Callback = (
  relKey: string,
  obj: KeyValueObj,
  prop: any,
  newAbsKey: string
) => void

/**
 * Helper function that iterates through all properties in a given object, and visits each node,
 * irrespective of whether it's a leaf property or not.
 *
 * @param obj The object to iterate through
 * @param callback Callback function call on each nested property
 * @param absKey The absolute key to access property from top level of the object
 */
const applyToAllProps = (
  obj: KeyValueObj,
  callback: Callback,
  absKey: string
) => {
  Object.keys(obj).forEach(relKey => {
    const newAbsKey = `${absKey}.${relKey}`
    if (typeof obj[relKey] === 'object' && obj[relKey] !== null) {
      callback(relKey, obj, obj[relKey], newAbsKey)
      applyToAllProps(obj[relKey], callback, newAbsKey)
    } else {
      callback(relKey, obj, obj[relKey], newAbsKey)
    }
  })
}

/**
 * @param meat the data
 * @param {string} name the name of the data instance
 * @param {any} station the context where the store is run (i.e. window)
 */
export const butcher = <M extends Record<string, any>>({
  meat,
  name,
  station = window
}: {
  meat: M
  name: string
  station?: any
}): Butcher<M> => {
  const butchered: Butch<M> = meat

  applyToAllProps(
    meat,
    (relKey, obj, prop, absKey) => {
      const internalRef: MeatCut<M> = `__${absKey}` as MeatCut<M>
      butchered[internalRef] = prop

      Object.defineProperty(obj, relKey, {
        set: (value: any) => {
          butchered[internalRef] = value
          station.dispatchEvent(
            new CustomEvent<CutDetail>(absKey, {
              detail: {
                meatCut: absKey,
                value
              }
            })
          )
        },
        get: () => butchered[internalRef]
      })
    },
    name
  )
  ;(butchered as Butcher<M>).__config = {
    name,
    station
  }

  return butchered as Butcher<M>
}

export const listen = <M>(
  butcher: Butcher<M>,
  meatCut: MeatCut<M>,
  callback: (e?: Event) => void
) => {
  const cutType = `${butcher.__config.name}.${meatCut}`
  butcher.__config.station.addEventListener(cutType, callback)
}
