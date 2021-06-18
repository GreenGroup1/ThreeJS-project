import { Canvas } from '@react-three/fiber'
import { Model } from "./Model"
import { OrbitControls } from "@react-three/drei"
import { useRecoilBridgeAcrossReactRoots_UNSTABLE, useRecoilState } from "recoil"
import { useState } from 'react'
import Viewcube from './Viewcube'
import Navigate from './Navigate'
import { ModelContext } from 'context'
import { useContext } from 'react'
import { ACESFilmicToneMapping, Color, sRGBEncoding } from 'three'
import { atoms } from 'misc'

export const ModelView = () => {
  const RecoilBridge = useRecoilBridgeAcrossReactRoots_UNSTABLE()
  const [ isOrthogonal, setOrthogonal ] = useState(false)
  const { orbit } = useContext(ModelContext)
  const [ cursor, setCursor ] = useRecoilState(atoms.cursor)
  const [ transformable, setTransformable ] = useRecoilState(atoms.transformable)

  return <div style={{position:'absolute', height:'100%', width:'100%'}}>
    <ModelContext.Consumer>
      {value=>(
        <Canvas 
          shadows
          color='black'
          dpr={window.devicePixelRatio*1}
          camera={{
            position:[600,800,600]
          }}
          onCreated={({ gl, scene }) => {
            gl.toneMapping = ACESFilmicToneMapping
            gl.outputEncoding = sRGBEncoding
            scene.background = new Color('#373740')
          }}
          style={{cursor}}
          onPointerMissed={()=>setTransformable(false)}
        >
          <ModelContext.Provider value={value}>
            <RecoilBridge>
              <ambientLight />
              <pointLight position={[100, 100, 100]} intensity={0.5} />
              <pointLight position={[-100, 100, -100]} intensity={0.5} />
              <pointLight position={[-100, 100, 100]} intensity={0.5} />
              <pointLight position={[100, 100, -100]} intensity={0.5} />
              <pointLight position={[0, 200, 0]} intensity={0.5} />
              <pointLight position={[0, -30, 0]} intensity={0.5} />

              <Model/>
              {isOrthogonal&&<>
                <gridHelper args={[10,20,'#000000','#131318']} scale={[10,10,10]}/>
                <gridHelper args={[10,20,'#000000','#131318']} scale={[10,10,10]} rotation={[0,0,Math.PI/2]}/>
                <gridHelper args={[10,20,'#000000','#131318']} scale={[10,10,10]} rotation={[0,Math.PI/2,Math.PI/2]}/>
              </>}
              {/*//@ts-ignore */}
              <OrbitControls ref={orbit} />
              <Navigate />
              <Viewcube {...{isOrthogonal, setOrthogonal}}/>
            </RecoilBridge>
          </ModelContext.Provider>
        </Canvas>
      )}
    </ModelContext.Consumer>
  </div>
}
