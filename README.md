# Butcher

[![Bundle Size](https://img.shields.io/bundlephobia/minzip/butcherjs?style=flat-square)](https://bundlephobia.com/result?p=butcherjs)
[![License](https://img.shields.io/github/license/drpoppyseed/butcherjs?style=flat-square)](https://github.com/DrPoppyseed/butcherjs/blob/main/LICENSE)
[![Registry](https://img.shields.io/npm/v/butcherjs?style=flat-square)](https://www.npmjs.com/package/butcherjs)
[![Open in CodeSandbox](https://img.shields.io/badge/Open%20demo%20in-CodeSandbox-blue?style=flat-square&logo=codesandbox)](https://codesandbox.io/s/youthful-curran-nsmhes)
[![Open in Codeanywhere](https://img.shields.io/badge/Open%20in-Codeanywhere-blue?style=flat-square&logo=codeanywhere)](https://app.codeanywhere.com/#https://github.com/peaske7/butcher.js/blob/144da42203c692361a3f88b3563bfa16afc5ddb8/README.md)

Butcher is a minimalistic state management library inspired
by [beedle](https://github.com/hankchizljaw/beedle)
, [zustand](https://github.com/pmndrs/zustand),
and an expanded derivative
of [mutilator](https://gist.github.com/Heydon/9de1a8b55dd1448281fad013503a5b7a) (
hence the name "butcher"). Butcher excels when you want to handle
relatively simple states using vanilla TS/JS in the browser. If you want
something more robust or something that handles complex states, I
suggest looking into other solutions
like [ Redux ](https://github.com/reduxjs/redux).

### First create a butcher

A butcher represents a unit of interactive state.

```typescript
import { butcher } from 'butcherjs'

const counter = butcher({
  name: 'counter',
  meat: {
    count: 0
  }
})
```

### Change the state, just like an Object

Once you've defined the butcher instance, you can now use it anywhere in your
project without directly passing it in via function parameters or class
variables. Directly change the state, just like an ordinary Object, but reap the
benefits of reactivity in other places where state changes are listened to.

```typescript
const button = () => {
  const buttonEl = document.getElementById('buttonEl')
  buttonEl.addEventListener("click", () => {
    counter.count += 1
  })
}
```

### React to state changes elsewhere

Use the `listen` function to react to state changes for a specific butcher
instance. Pass in a callback function that runs when the state is updated. This
way, there is no need to worry about extraneous renders for components that
don't matter.

```typescript
import { listen } from 'butcherjs'

const currentCount = () => {
  const currentCountEl = document.getElementById('currentCountEl')
  listen(counter, 'count', () => {
    currentCountEl.innerHTML = `${counter.count}`
  })
}
```
