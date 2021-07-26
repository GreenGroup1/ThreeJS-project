import { atoms, useKeyPress } from "misc"
import { useEffect, useRef } from "react"
import { Vector3 as V3, DoubleSide, Event, Plane, FontLoader, BufferGeometry, BufferAttribute, Mesh, Material  } from 'three'
import { useRecoilState } from 'recoil'
import { OrbitControls } from "three-stdlib"
import { TransformControls } from "./TransformControls"
import { useContext } from "react"
import { ModelContext } from "context"
import { useFrame, useThree } from "@react-three/fiber"
import Renner from 'assets/Renner.json'


export const Model = () => {
  const [ model ] = useRecoilState(atoms.model)
  const [ mode ] = useRecoilState(atoms.transformMode)
  const [ transformable, setTransformable ] = useRecoilState(atoms.transformable)
  const [ needsUpdate, setNeedsUpdate ] = useRecoilState(atoms.needsUpdate)
  const [ needsSave, setNeedsSave ] = useRecoilState(atoms.needsSave)
  const [ , setCursor ] = useRecoilState(atoms.cursor)

  const [ coordinate ] = useRecoilState(atoms.transformCoordinate)
  const [ loading ] = useRecoilState(atoms.loading)
  const [ selected, setSelected ] = useRecoilState(atoms.selected)
  const planeRef = useRef<Plane|null>(new Plane( new V3( 0, - 1, 0 ), 0.8 ))
  const { transform, geometryRef, orbit, modelRef, textRef, textTransform } = useContext(ModelContext)
  const { gl, scene, camera } = useThree()
  const [ deletionMode ] = useRecoilState(atoms.deletionMode)
  const mapRef = useRef<Uint32Array>()
  const dPress = useKeyPress('d')
  const [ isSolid ] = useRecoilState(atoms.isSolid)
  const [ state, setState ] = useRecoilState(atoms.state)

  // useEffect(()=>{
  //   if(deletionMode && !dPress){
  //     console.log('update')
  //     setCursor('wait')
  //     setNeedsSave(true)
  //   }
  // },[dPress, deletionMode, setNeedsSave])

  // useEffect(()=>{
  //   if(modelRef.current&&(needsSave)){
  //     console.log('set new state')
  //     setCursor('wait')
  //     const copy = JSON.parse(JSON.stringify(modelRef.current)) as Mesh<BufferGeometry, Material | Material[]>
  //     setState(pstate=>pstate.findIndex(v=>v.current)===pstate.length-1 ?
  //       [...(state.length<3? state: state.slice(1)).map(v=>({...v, current:false})), {mesh: copy, current:true}]:
  //       [...(state.slice(0, pstate.findIndex(v=>v.current)+1)).map(v=>({...v, current:false})), {mesh: copy, current:true}]
  //     )
  //     setCursor('')
  //     setNeedsSave(false)
  //   }
  // },[needsSave])

  // useEffect(()=>console.log(state),[state])

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
  {isSolid && <Texts/>}
  </>
}

function Texts () {
  const [ transformable, setTransformable ] = useRecoilState(atoms.transformable)
  const [ coordinate, setCoordinate ] = useRecoilState(atoms.transformCoordinate)
  const [ selected, setSelected ] = useRecoilState(atoms.selected)
  const [ text, setText ] = useRecoilState(atoms.text)
  const { textRef, textTransform } = useContext(ModelContext)
  const font = new FontLoader().parse(Renner);

  return  <>
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
            <textGeometry attach='geometry' args={[text, {font, size: 6, height: 6}]} />
            <meshLambertMaterial attach="material" color="#999" side={DoubleSide}  opacity={0.6}/>
      </mesh>
    </TransformControls>
</>
}