import React, { MutableRefObject, ReactNode, useRef } from 'react'
import { BufferGeometry, Camera, Object3D } from 'three'
import { OrbitControls, OrbitControls as OrbitControlsType, TransformControls as TransformControlsImpl } from 'three-stdlib'


export const ModelContext = React.createContext({
  orbit: {current:null} as MutableRefObject<OrbitControls | null>,
  geometryRef: {current:undefined} as MutableRefObject<BufferGeometry|undefined>,
  modelRef: {current:undefined} as MutableRefObject<Object3D|undefined>,
  transform: {current:null} as MutableRefObject<TransformControlsImpl<Camera>|null>
});

export default function Context(props:{children:ReactNode|ReactNode[]}) {
  const geometryRef = useRef<BufferGeometry|undefined>()
  const modelRef = useRef<Object3D|undefined>()
  const orbit = useRef<OrbitControlsType>(null)
  const transform = useRef<TransformControlsImpl<Camera>>(null)


  return <ModelContext.Provider value={{orbit,modelRef,geometryRef, transform}}>
    {props.children}
  </ModelContext.Provider>
}