import { butcher } from 'butcherjs'

export const count = butcher({
  name: 'count',
  meat: {
    count: 0
  }
})
