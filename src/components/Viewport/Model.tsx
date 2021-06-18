import { atoms } from "misc"
import { useEffect } from "react"
import { DoubleSide, Event } from 'three'
import { useRecoilState } from 'recoil'
import { OrbitControls } from "three-stdlib"
import { TransformControls } from "./TransformControls"
import { useContext } from "react"
import { ModelContext } from "context"
import { useFrame, useThree } from "@react-three/fiber"

export const Model = () => {
  const [ model, setModel ] = useRecoilState(atoms.model)
  const [ mode, setMode ] = useRecoilState(atoms.transformMode)
  const [ transformable, setTransformable ] = useRecoilState(atoms.transformable)
  const [ needsUpdate, setNeedsUpdate ] = useRecoilState(atoms.needsUpdate)
  const [ coordinate, setCoordinate ] = useRecoilState(atoms.transformCoordinate)
  const [ cursor, setCursor ] = useRecoilState(atoms.cursor)

  const { transform, geometryRef, orbit, modelRef } = useContext(ModelContext)
  const { gl, scene, camera, size } = useThree()
  console.log(transform.current)
  useFrame(()=>{
    if(needsUpdate){
      gl.render(scene, camera)
      setNeedsUpdate(false)
    }
  },1)

  useEffect(() => {
    if (transform.current && transformable) {
      const controls = transform.current
      controls.setMode(mode)
      const callback = (event:Event) => {
        ((orbit.current as OrbitControls).enabled = !event.value)}
      controls.addEventListener("dragging-changed", callback)
      return () => controls.removeEventListener("dragging-changed", callback)
    }
  })

  if ((!model) || (!geometryRef.current)) {
    return null
  }
    
  return <>
  <group>
    <TransformControls 
      showX={transformable}
      showY={transformable}
      showZ={transformable}
      //@ts-ignore
      ref={transform} size={0.6} space={coordinate}>
      <mesh 
        ref={modelRef} 
        onClick={()=>{setTransformable(true)}}
        // onPointerEnter={()=>setCursor('pointer')} 
        // onPointerLeave={()=>setCursor('')}
        geometry={geometryRef.current} 
        position={[0, 0, 0]} 
        scale={[1, 1, 1]}>
          <meshLambertMaterial attach="material" color="#999" side={DoubleSide} />
      </mesh>
    </TransformControls>
  </group>
  
  </>
}

