import { Canvas } from '@react-three/fiber'
import { Model } from "./Model"
import { OrbitControls } from "@react-three/drei"
import { OrbitControls as OrbitControlsType } from 'three-stdlib'
import { useRecoilBridgeAcrossReactRoots_UNSTABLE } from "recoil"
import { MutableRefObject, useRef, useState } from 'react'
import { BufferGeometry, Object3D } from 'three'
import Viewcube from './Viewcube'
import Navigate from './Navigate'
import { useEffect } from 'react'

type ModelViewProps = {
  geometryRef:MutableRefObject<BufferGeometry|undefined>
  modelRef:MutableRefObject<Object3D|undefined>
}

export const ModelView = ({geometryRef, modelRef}:ModelViewProps) => {
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()
  const orbit = useRef<OrbitControlsType>(null)
  const [ isOrthogonal, setOrthogonal ] = useState(false)

  
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
          <pointLight position={[-10, 10, 10]} />
          <Model {...{orbit, geometryRef, modelRef}} />
          {isOrthogonal&&<>
            <gridHelper args={[10,20,'#bbb','#ccc']} />
            <gridHelper args={[10,20,'#bbb','#ccc']} rotation={[0,0,Math.PI/2]}/>
            <gridHelper args={[10,20,'#bbb','#ccc']} rotation={[0,Math.PI/2,Math.PI/2]}/>
          </>}
          {/*//@ts-ignore */}
          <OrbitControls ref={orbit} />
          <Navigate {...{orbit: orbit as MutableRefObject<OrbitControlsType>}} />
          <Viewcube {...{orbit, isOrthogonal, setOrthogonal}}/>
        </RecoilBridge>
      </Canvas>
  </div>
}
