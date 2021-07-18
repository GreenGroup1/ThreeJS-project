import { atoms, useKeyPress } from "misc"
import { useEffect, useRef, useState } from "react"
import { BufferAttribute, BufferGeometry,Vector3 as V3, DoubleSide, Event, Plane, Float32BufferAttribute, FontLoader, PlaneBufferGeometry, TextureLoader } from 'three'
import { useRecoilState } from 'recoil'
import { OrbitControls } from "three-stdlib"
import { TransformControls } from "./TransformControls"
import { useContext } from "react"
import { ModelContext } from "context"
import { useFrame, useThree, Vector3 } from "@react-three/fiber"
import Renner from 'assets/Renner.json'
import Disk from 'assets/disc.png'

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
  const planeRef = useRef<Plane|null>(new Plane( new V3( 0, - 1, 0 ), 0.8 ))
  const { transform, geometryRef, orbit, modelRef, textRef, textTransform } = useContext(ModelContext)
  const { gl, scene, camera, size, raycaster } = useThree()
  const [ deletionMode, setDeletionMode ] = useRecoilState(atoms.deletionMode)
  const mapRef = useRef<Uint32Array>()
  const [faces, setFaces] = useState<Set<number>>(new Set())
  const font = new FontLoader().parse(Renner);
  const sprite = new TextureLoader().load( Disk );
  const dPress = useKeyPress('d')

  const flip = (obj:any) => Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => [v, Number(k)])
      .filter((v,k)=>k && k!==-1)
  )

  if(geometryRef?.current?.index?.array && !mapRef.current){
    mapRef.current = flip(geometryRef?.current?.index?.array)
  }

  function deleteFace(ind:number){
    if(geometryRef?.current?.index && deletionMode){
      //@ts-ignore
      geometryRef.current.index.array[Math.floor((ind||0) * 3)] = 0
      //@ts-ignore
      geometryRef.current.index.array[Math.floor((ind||0) * 3)+1] = 0
      //@ts-ignore
      geometryRef.current.index.array[Math.floor((ind||0) * 3)+2] = 0
      geometryRef.current.index.needsUpdate = true;
    }
  }

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
      geometry={geometryRef.current} 
      position={[0, 0, 0]} 
      scale={[1, 1, 1]}>
        <meshStandardMaterial clippingPlanes={[ planeRef.current ]} clipShadows={true} needsUpdate={true} attach="material" color="#cc7357" side={DoubleSide} />

    </mesh>
    <points onPointerMove={(e) =>{
        if(dPress && geometryRef?.current?.index && deletionMode && e.index && mapRef.current){
          const ind = mapRef.current[e.index]
          deleteFace(Math.trunc(ind/3))
        }
    }} geometry={geometryRef.current}>
            <pointsMaterial {...{ flatShading:true,  size:2, transparent: true, opacity:0 }} />
    </points>
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
          {/* <planeGeometry attach='geometry' args={[100,100]}/> */}
          <textGeometry attach='geometry' args={[text, {font, size: 9, height: 12}]} />
          <meshLambertMaterial attach="material" color="#999" side={DoubleSide} transparent={true} opacity={0.2}/>
    </mesh>
  </TransformControls>

  </>
}

