import { fireEvent } from '@testing-library/dom'
import { Butcher, butcher, listen } from '../src'

let countTracker: Butcher<{
  count: number
}>
let countSpan: HTMLSpanElement
let incBtn: HTMLButtonElement

beforeEach(() => {
  document.body.innerHTML = `
    <button id='incBtn'>Increase</button>
    <p>Count: <span id='countSpan'></span></p>
  `

  countTracker = butcher({
    name: 'countTracker',
    meat: {
      count: 0
    }
  })

  countSpan = document.getElementById('countSpan')!
  incBtn = document.getElementById('incBtn')! as HTMLButtonElement
})

afterEach(() => {
  jest.clearAllMocks()
})

test('is simple state accessible', () => {
  countSpan.innerHTML = `${countTracker.count}`
  expect(countSpan.innerHTML).toBe('0')
})

test('is simple state interactive', () => {
  // update state
  countTracker.count = 2
  countSpan.innerHTML = `${countTracker.count}`
  expect(countSpan.innerHTML).toBe('2')
})

test('does listen callback react to simple state changes', () => {
  countSpan.innerHTML = '0'

  // listen to state change
  listen(countTracker, 'count', () => {
    countSpan.innerHTML = `${countTracker.count}`
  })

  // update count on button click
  incBtn.addEventListener('click', () => {
    countTracker.count += 1
  })

  // simulate button click
  fireEvent.click(incBtn)

  expect(countSpan.innerHTML).toBe('1')
})
