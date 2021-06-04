import { atom } from 'recoil'
import { BufferGeometry } from "three"

export const model = atom({
  key: 'model',
  default: undefined as string|undefined
})
