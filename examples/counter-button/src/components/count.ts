import { listen } from 'butcherjs'
import { count } from '../state'

export const counter = () => {
  const counterEl = document.getElementById('counter')!
  listen(count, 'count', () => {
    counterEl.innerHTML = `${count.count}`
  })
}
