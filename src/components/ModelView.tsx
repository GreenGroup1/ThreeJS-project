import { Suspense, useRef } from "react"
import { Canvas, useFrame, useThree, extend, GridHelperProps } from '@react-three/fiber'
import { Model } from "./Model"
import { OrbitControls, TransformControls } from 'three-stdlib'
extend({ OrbitControls, TransformControls })

const Controls = () => {
  const OrbitRef = useRef<any>()
  const { camera, gl } = useThree()

  useFrame(() => {
    OrbitRef.current.update()
  })

  return (
    <orbitControls
      maxZoom={10}
      minZoom={0}
      enableZoom={true}
      enablePan={true}
      enableDamping
      dampingFactor={0.5}
      args={[camera, gl.domElement]}
      ref={OrbitRef}
    />
  )
}

export const ModelView = () => {
  return <div style={{position:'absolute', height:'100%', width:'100%'}}><Suspense fallback={<div>LOADING</div>}>
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Model />
      <gridHelper args={[10,20]} />
      <Controls />
    </Canvas>
  </Suspense></div>
}
