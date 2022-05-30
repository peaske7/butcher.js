import { fireEvent } from '@testing-library/dom'
import { Butcher, butcher, listen } from '../src'

type DummyInputStore = {
  fields: { str: string; num: number }
  unrelated: string
}

let dummyInputStore: Butcher<DummyInputStore>
let strStoreViewSpan: HTMLSpanElement
let strStoreInput: HTMLInputElement

beforeEach(() => {
  document.body.innerHTML = `
    <p id='strStoreViewPar'>Str:&nbsp;<span id='strStoreViewSpan'></span></p>
    <input id='strStoreInput'>
  `

  dummyInputStore = butcher({
    name: 'nestedStore',
    meat: {
      fields: {
        str: 'initial',
        num: 0
      },
      unrelated: 'initial'
    }
  })

  strStoreInput = document.getElementById('strStoreInput')! as HTMLInputElement
  strStoreViewSpan = document.getElementById('strStoreInput')!
})

afterEach(() => {
  jest.clearAllMocks()
})

test('is nested state accessible', () => {
  strStoreViewSpan.innerHTML = dummyInputStore.fields.str
  expect(strStoreViewSpan.innerHTML).toBe('initial')
})

test('is nested state interactive', () => {
  // update state
  dummyInputStore.fields.str = 'artificiallyChanged'
  strStoreViewSpan.innerHTML = `${dummyInputStore.fields.str}`
  expect(strStoreViewSpan.innerHTML).toBe('artificiallyChanged')
})

test('does listen callback react to nested state changes', () => {
  // initialize state updater
  strStoreInput.addEventListener('input', event => {
    dummyInputStore.fields.str = (event.target as HTMLInputElement).value
  })

  // listen to state change
  listen(dummyInputStore, 'fields.str', () => {
    strStoreViewSpan.innerHTML = `${dummyInputStore.fields.str}`
  })

  // simulate input event
  fireEvent.change(strStoreInput, { target: { value: 'hello' } })
  strStoreInput.dispatchEvent(new InputEvent('input'))

  expect(strStoreViewSpan.innerHTML).toBe('hello')
})
