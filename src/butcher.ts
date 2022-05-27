type Merge<A, B> = { [K in keyof (A | B)]: K extends keyof B ? B[K] : A[K] }
export type CutDetail = {
  meatCut: string
  value: string
}
export type Ref<M> = {
  [key in keyof M as `${string & key}`]: any
}
export type Butch<M> = Merge<Ref<M>, M>
export type MeatCut<M> = Extract<keyof M, string>
export type ButcherConfig = {
  __config: {
    name: string
    station: any
  }
}
export type Butcher<M> = Merge<Ref<M>, M> & ButcherConfig

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

  for (const meatCut in meat) {
    const internalRef: keyof Ref<M> = `__${meatCut}`
    butchered[internalRef] = meat[meatCut]

    const cutType = `${name}:${meatCut}`

    Object.defineProperty(butchered, meatCut, {
      set: (value: any) => {
        butchered[internalRef] = value
        station.dispatchEvent(
          new CustomEvent<CutDetail>(cutType, {
            detail: { meatCut, value }
          })
        )
      },
      get: () => butchered[internalRef]
    })
  }

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
  const cutType = `${butcher.__config.name}:${meatCut}`
  butcher.__config.station.addEventListener(cutType, callback)
}
