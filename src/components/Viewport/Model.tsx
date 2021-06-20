import { atoms } from "misc"
import { useEffect } from "react"
import { DoubleSide, Event, FontLoader } from 'three'
import { useRecoilState } from 'recoil'
import { OrbitControls } from "three-stdlib"
import { TransformControls } from "./TransformControls"
import { useContext } from "react"
import { ModelContext } from "context"
import { useFrame, useThree } from "@react-three/fiber"
import Renner from 'assets/Renner.json'

export const Model = () => {
  const [ model, setModel ] = useRecoilState(atoms.model)
  const [ mode, setMode ] = useRecoilState(atoms.transformMode)
  const [ transformable, setTransformable ] = useRecoilState(atoms.transformable)
  const [ needsUpdate, setNeedsUpdate ] = useRecoilState(atoms.needsUpdate)
  const [ coordinate, setCoordinate ] = useRecoilState(atoms.transformCoordinate)
  const [ cursor, setCursor ] = useRecoilState(atoms.cursor)
  const [ loading, setLoading ] = useRecoilState(atoms.loading)
  const [ selected, setSelected ] = useRecoilState(atoms.selected)
  const [ text, setText ] = useRecoilState(atoms.text)

  const { transform, geometryRef, orbit, modelRef, textRef, textTransform } = useContext(ModelContext)
  const { gl, scene, camera, size } = useThree()
  console.log(transform.current)

  const font = new FontLoader().parse(Renner);

  useFrame(()=>{
    if(needsUpdate){
      gl.render(scene, camera)
      setNeedsUpdate(false)
    }
  },1)

  useEffect(() => {
    if (transform.current && transformable && selected==='model') {
      const controls = transform.current
      controls.setMode(mode)
      const callback = (event:Event) => {
        ((orbit.current as OrbitControls).enabled = !event.value)}
      controls.addEventListener("dragging-changed", callback)
      return () => controls.removeEventListener("dragging-changed", callback)
    }
    if (textTransform.current && transformable && selected==='text') {
      const controls = textTransform.current
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
  <TransformControls 
    showX={transformable&&selected==='model'}
    showY={transformable&&selected==='model'}
    showZ={transformable&&selected==='model'}
    // visible={selected!=='model'}
    //@ts-ignore
    ref={transform} size={0.6} space={coordinate}>
    <mesh 
      ref={modelRef} 
      onClick={()=>{
        console.log('model')
        if(!loading){
          setSelected('model')
          setTransformable(true)
        }
      }}
      // onPointerEnter={()=>setCursor('pointer')} 
      // onPointerLeave={()=>setCursor('')}
      geometry={geometryRef.current} 
      position={[0, 0, 0]} 
      scale={[1, 1, 1]}>
        <meshLambertMaterial attach="material" color="#999" side={DoubleSide} />
    </mesh>
  </TransformControls>
  <TransformControls 
    showX={transformable&&selected==='text'}
    showY={transformable&&selected==='text'}
    showZ={transformable&&selected==='text'}
    position={[-8,20,13]} 
    rotation={[0,0,0]} 
    // visible={selected!=='text'}
    //@ts-ignore
    ref={textTransform} size={0.6} space={coordinate}>
    <mesh 
      ref={textRef}  
      onClick={()=>{
        console.log('text')
        setSelected('text')
        setTransformable(true)
      }}>
          <textGeometry attach='geometry' args={[text, {font, size: 12, height: 12}]} />
          <meshStandardMaterial attach='material' />
    </mesh>
  </TransformControls>

  </>
}

