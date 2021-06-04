import { atom } from 'recoil'
import { BufferGeometry } from "three"

export const model = atom({
  key: 'model',
  default: undefined as string|undefined
})

export const transformMode = atom({
  key: 'transformMode',
  default: "rotate" as "scale"|"rotate"|"translate"
})
