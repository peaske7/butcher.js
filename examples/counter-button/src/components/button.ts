import { count } from '../state'

export const button = () => {
  const buttonEl = document.getElementById('btn')!
  buttonEl?.addEventListener('click', () => {
    count.count += 1
  })
}
