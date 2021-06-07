import { Vector3 } from 'three'
import { MutableRefObject, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { OrbitControls } from 'three-stdlib'
import { useRecoilState } from 'recoil'
import { atoms, defaultPosition } from 'misc'
import lerp from "lerp"

type NavigateProps = {
  orbit: MutableRefObject<OrbitControls>, 
}

export default function Navigate({ orbit }:NavigateProps) {
  const { camera } = useThree()
  const [ zoom, setZoom ] = useRecoilState(atoms.zoom)
  const [ nextZoom, setNextZoom ] = useRecoilState(atoms.nextZoom)
  const [ dollyFinished, setDollyFinished ] = useRecoilState(atoms.dolly)
  const [ viewport, setViewport ] = useRecoilState(atoms.viewport)

  useEffect(()=>{
    setDollyFinished(false)
    console.log('set dolly false')
  }, [ viewport, setDollyFinished ] )

  const p = 0.000001
  const t = 1
  
  useFrame(() => {
    if((!dollyFinished)&&(!nextZoom)){
      {
        const {x,y,z} = camera.position
        camera.position.set(
          lerp(x, viewport.x, t),
          lerp(y, viewport.y, t),
          lerp(z, viewport.z, t)
        )
      }
      camera.zoom = lerp(camera.zoom, viewport.zoom, t)
      {
        const {x,y,z} = orbit.current.target
        if (Math.abs(x-(viewport.tx))<p) setDollyFinished( true )
        orbit.current.target = new Vector3(
          lerp(x, viewport.tx, t),
          lerp(y, viewport.ty, t),
          lerp(z, viewport.tz, t)
        )
      }
      orbit.current.update()
      camera.updateProjectionMatrix()
    }else if((!dollyFinished)&&nextZoom){
      camera.zoom = lerp(camera.zoom, nextZoom, t)
      if (Math.abs(camera.zoom-nextZoom)<0.05){
        setDollyFinished( true )
        setNextZoom( null )
        if(camera.zoom<0.5) {setViewport(defaultPosition); setDollyFinished(true)}
      }
      orbit.current.update()
      camera.updateProjectionMatrix()
    }
    setZoom(camera.zoom)
    
    })

  return null
}
