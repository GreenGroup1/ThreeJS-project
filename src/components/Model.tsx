import { atoms, vertices } from "misc"
import { MutableRefObject, useContext, useRef } from "react"
import { DoubleSide } from 'three'
import { useRecoilState } from 'recoil'
import { BufferGeometry } from "three"

export const Model = ({modelRef}:{modelRef:MutableRefObject<BufferGeometry|undefined>}) => {
    const [ model, setModel ] = useRecoilState(atoms.model)

    if ((!model) || (!modelRef.current)) {
        return null
    }

    return <>
      <mesh geometry={modelRef.current} position={[0, 1.5, 0]} rotation={[0, 0, 0]} scale={[0.1, 0.1, 0.1]}>
        <meshLambertMaterial attach="material" color="#999" side={DoubleSide} />
        {/* <points geometry={modelRef.current}>
            <pointsMaterial size={0.005} color="grey" depthTest={false} />
        </points> */}
      </mesh>
    </>
}
