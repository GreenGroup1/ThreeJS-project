import { Canvas } from '@react-three/fiber'
import { Model } from "./Model"
import { OrbitControls } from "@react-three/drei"
import { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from "recoil"
import { MutableRefObject, useRef } from 'react'
import { BufferGeometry } from 'three'
import Viewcube from './Viewcube'

export const ModelView = ({modelRef}:{modelRef:MutableRefObject<BufferGeometry|undefined>}) => {
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()
  const orbit = useRef<OrbitControlsType>(null)
  
  return <div style={{position:'absolute', height:'100%', width:'100%'}}>
      <Canvas 
        shadows
        dpr={window.devicePixelRatio*1}
        camera={{
          position:[3,4,3]
        }}
      >
        <RecoilBridge>
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Model {...{orbit, modelRef}} />
          <gridHelper args={[10,20,'#bbb','#ccc']} />
          {/*//@ts-ignore */}
          <OrbitControls ref={orbit} />
          <Viewcube {...{orbit}}/>
        </RecoilBridge>
      </Canvas>
  </div>
}
