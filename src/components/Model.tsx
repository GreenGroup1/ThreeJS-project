import { atoms } from "misc"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { DoubleSide, Camera, Event, BufferGeometry } from 'three'
import { useRecoilState } from 'recoil'
import { OrbitControls, TransformControls as TransformControlsImpl } from "three-stdlib"
import { TransformControls } from "./TransformControls"

type ModelProps = {
  orbit:MutableRefObject<OrbitControls|null>,
  modelRef:MutableRefObject<BufferGeometry|undefined>
}

export const Model = ({orbit, modelRef}:ModelProps) => {
  const [ model, setModel ] = useRecoilState(atoms.model)
  const transform = useRef<TransformControlsImpl<Camera>>(null)
  const [ mode, setMode ] = useRecoilState(atoms.transformMode)

  useEffect(() => {
    if (transform.current) {
      const controls = transform.current
      controls.setMode(mode)
      const callback = (event:Event) => {console.log('dragged');((orbit.current as OrbitControls).enabled = !event.value)}
      controls.addEventListener("dragging-changed", callback)
      return () => controls.removeEventListener("dragging-changed", callback)
    }
  })

  if ((!model) || (!modelRef.current)) {
    return null
  }
    
  return <>
  {/*//@ts-ignore  */}
    <TransformControls ref={transform} size={0.6}>
      <mesh geometry={modelRef.current} position={[0, 1.5, 0]} rotation={[0, 0, 0]} scale={[0.1, 0.1, 0.1]}>
        <meshLambertMaterial attach="material" color="#999" side={DoubleSide} />
      </mesh>
    </TransformControls>
  </>
}
