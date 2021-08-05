import { Maybe, Users } from 'generated'
import { atom } from 'recoil'
import { BufferGeometry, Material, Mesh } from 'three'
import { defaultPosition, ViewportProps } from "../types"

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
  default: ''
})

export const user = atom({
  key: 'user',
  default: undefined as Maybe<Pick<Users, "id" | "avatar_url" | "created_at" | "display_name">> | undefined,
});


export const deletionMode = atom({
  key: 'deletionMode',
  default: false
});

export const keysPressed = atom({
  key: 'keysPressed',
  default: {ctrl:false} as {[key:string]:boolean}
});

export const popups = atom({
  key: 'popups',
  default: null as null|'emboss'|'solidify'
});

export const isSolid = atom({
  key: 'isSolid',
  default: false
});

export const state = atom({
  key: 'state',
  default: [] as {
    buffer: Uint32Array,
    current?: boolean
  }[]
});

export const needsSave = atom({
  key: 'needsSave',
  default: false
});
