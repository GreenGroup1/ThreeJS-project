import { ReactThreeFiber } from "@react-three/fiber"
import { OrbitControls } from "three-stdlib"

declare global {
    namespace JSX {
        interface IntrinsicElements {
            orbitControls: ReactThreeFiber.Node<OrbitControls, typeof OrbitControls>
        }
    }
}
