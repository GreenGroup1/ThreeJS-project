import { atoms } from "misc"
import { MutableRefObject, useEffect, useRef, useState } from "react"
import { DoubleSide, Camera, Event, BufferGeometry, Object3D } from 'three'
import { useRecoilState } from 'recoil'
import { OrbitControls, TransformControls as TransformControlsImpl, mergeVertices } from "three-stdlib"
import { TransformControls } from "./TransformControls"
import { Mesh } from 'core/mesh'
import { MeshIO } from 'core/utils/meshio'
import { OBJExporter } from 'three/examples/jsm/exporters/OBJExporter'
import { Vertex } from 'core/vertex'

type ModelProps = {
  orbit:MutableRefObject<OrbitControls|null>,
  modelRef:MutableRefObject<BufferGeometry|undefined>
}

export const Model = ({orbit, modelRef}:ModelProps) => {
  const [ model, setModel ] = useRecoilState(atoms.model)
  const transform = useRef<TransformControlsImpl<Camera>>(null)
  const [ mode, setMode ] = useRecoilState(atoms.transformMode)
  const mesh = useRef<Object3D>(null)

  useEffect(() => {
    if (transform.current) {
      const controls = transform.current
      controls.setMode(mode)
      const callback = (event:Event) => {console.log('dragged');((orbit.current as OrbitControls).enabled = !event.value)}
      controls.addEventListener("dragging-changed", callback)
      return () => controls.removeEventListener("dragging-changed", callback)
    }
  })

  useEffect(()=>{
    if(model && mesh.current){
      // console.log(mesh.current, 'it is mesh')
      // //@ts-ignore
      // const exporter = new OBJExporter()
      // const objFormatted = exporter.parse(mesh.current)
      // const meshSoup = MeshIO.readOBJ(objFormatted)
      // //@ts-ignore
      // const filterIndices = meshSoup.f.filter((ind:number)=>ind===-1)
      // console.log(filterIndices)
      // const meshObject = new Mesh().build(meshSoup)
      
      // const vertex = new Vertex()
      // //@ts-ignore
      // console.log(meshSoup, meshSoup?.v[0], meshObject, 'formatted')

      // console.log(objFormatted, mesh, meshSoup, 'it is mesh')
    }
  },[model])

  if ((!model) || (!modelRef.current)) {
    return null
  }
    
  return <>
  {/*//@ts-ignore  */}
    <TransformControls ref={transform} size={0.6}>
      <mesh ref={mesh} geometry={modelRef.current} position={[0, 1.5, 0]} rotation={[0, 0, 0]} scale={[0.1, 0.1, 0.1]}>
        <meshLambertMaterial attach="material" color="#999" side={DoubleSide} />
      </mesh>
    </TransformControls>
  </>
}
