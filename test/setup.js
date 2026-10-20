import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(cleanup)

// jsdom does not implement modal <dialog> or scrolling.
HTMLDialogElement.prototype.showModal ??= function () {
  this.open = true
}
HTMLDialogElement.prototype.close ??= function () {
  this.open = false
  this.dispatchEvent(new Event('close'))
}
Element.prototype.scrollIntoView ??= () => {}
// Recent Chrome returns a Promise from scrollTo; mimic it so effects that return it fail here.
window.scrollTo = () => Promise.resolve()
