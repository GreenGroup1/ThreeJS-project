import { Scene, Matrix4, Camera, Mesh, Vector3 } from 'three'
import { useRef, useMemo, useState, MutableRefObject, ReactElement, useEffect } from 'react'
import { useFrame, useThree, createPortal } from '@react-three/fiber'
import { PerspectiveCamera, useCamera } from '@react-three/drei'
import { OrbitControls } from 'three-stdlib'
import { atoms, ViewportProps } from 'misc'
import { useRecoilState } from 'recoil'
type ViewcubeProps = {
  orbit:MutableRefObject<OrbitControls|null>,
  setOrthogonal: Function,
  isOrthogonal: boolean
}

const boxPositions:ViewportProps[] = [
  {tx:0,ty:0,tz:0,x:10,y:0,z:0,zoom:1},
  {tx:0,ty:0,tz:0,x:-10,y:0,z:0,zoom:1},
  {tx:0,ty:0,tz:0,x:0,y:10,z:0,zoom:1},
  {tx:0,ty:0,tz:0,x:0,y:-10,z:0,zoom:1},
  {tx:0,ty:0,tz:0,x:0,y:0,z:10,zoom:1},
  {tx:0,ty:0,tz:0,x:0,y:0,z:-10,zoom:1}
]

export default function Viewcube({orbit, isOrthogonal, setOrthogonal}:ViewcubeProps) {
  const { gl, scene, camera, size } = useThree()
  const virtualScene = useMemo(() => new Scene(), [])
  const virtualCam = useRef<Camera>()
  const ref = useRef<Mesh>()
  const [hover, set] = useState<number|null>(null)
  const matrix = new Matrix4()
  const [viewport, setViewport] = useRecoilState(atoms.viewport)

  useFrame(() => {
    if(!ref.current || !orbit.current){ return }
    matrix.copy(camera.matrix).invert()
    let dir = camera.position.clone().sub(orbit.current.target)
		ref.current.position.copy(dir.normalize().multiplyScalar(1.75))
    ref.current.quaternion.setFromRotationMatrix(matrix)
    gl.autoClear = true
    gl.render(scene, camera)
    gl.autoClear = false
    gl.clearDepth()
    if(!virtualCam.current){ return }
    gl.render(virtualScene, virtualCam.current)
    CheckOrtho()

    function CheckOrtho (){
      const precision = 0.1
      if(orbit.current?.target && orbit.current.object.position ){
        const {x:tx,y:ty,z:tz} = orbit.current?.target
        const {x,y,z} = orbit.current.object.position
        if(boxPositions.reduce((acc,v)=>{
          const near = Math.abs(v.tx-tx)<precision && 
            Math.abs(v.ty-ty)<precision && 
            Math.abs(v.tz-tz)<precision && 
            Math.abs(v.x-x)<precision && 
            Math.abs(v.y-y)<precision && 
            Math.abs(v.z-z)<precision
          return acc || near
        }, false)){
          if(!isOrthogonal){
            setOrthogonal(true)
          }
        }else{
          if(isOrthogonal){
            setOrthogonal(false)
          }
        }
      }
    }
  }, 1)

  return createPortal(
    <>
      <PerspectiveCamera ref={virtualCam} view={{
        enabled: true,
        width: size.width,
        height: size.height,
        fullWidth: size.width,
        fullHeight: size.height,
        offsetX: -(size.width/2-80),
        offsetY: (size.height/2-80)
      }} makeDefault={false} position={[0, 0, 100]} />
      <mesh
        ref={ref}
        raycast={useCamera(virtualCam as MutableRefObject<Camera>)}
        position={[0, 0, 0]}
        onClick={()=>{
          if(hover!==null) {
            console.log(boxPositions[hover])
            setViewport({...boxPositions[hover], timestamp: new Date()})
            setOrthogonal(true)
          }
          console.log(hover, orbit.current?.target, camera.position, camera.zoom)
        }}
        onPointerOut={() => set(null)}
        onPointerMove={(e) => set(Math.floor((e.faceIndex||0) / 2))}
      >
        {[...Array(6)].map((_, index) => (
          <meshStandardMaterial attachArray="material" key={index} color={hover === index ? 'hotpink' : 'white'} />
        ))}
        <boxGeometry args={[8, 8, 8]} />
      </mesh>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
      <pointLight position={[1, 10, 1]} intensity={0.5} />
    </>,
    virtualScene
  ) as ReactElement
}

