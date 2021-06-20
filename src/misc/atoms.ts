import { atom } from 'recoil'
import { defaultPosition, ViewportProps } from "./types"

export const model = atom({
  key: 'model',
  default: undefined as string|undefined
})

export const transformMode = atom({
  key: 'transformMode',
  default: "rotate" as "scale"|"rotate"|"translate"
})

export const transformable = atom({
  key: 'transformable',
  default: false
})

export const dolly = atom({
  key: 'dolly',
  default: true
})

export const zoom = atom({
  key: 'zoom',
  default: 0.18
})

export const nextZoom = atom({
  key: 'nextZoom',
  default: null as number|null
})

export const viewport = atom({
  key: 'viewport',
  default: defaultPosition as ViewportProps
})

export const needsUpdate = atom({
  key: 'needsUpdate',
  default: false
})

export const transformCoordinate = atom({
  key: 'transformCoordinate',
  default: 'local' as 'local'|'world'
})

export const loading = atom({
  key: 'loading',
  default: false
})

export const cursor = atom({
  key: 'cursor',
  default: ''
})

export const selected = atom({
  key: 'seleted',
  default: 'model' as 'model'|'text'
})

export const text = atom({
  key: 'text',
  default: 'test'
})
