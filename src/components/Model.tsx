import { Downgraded, useState } from '@hookstate/core'
import { store } from "../App"
import { BufferAttribute, BufferGeometry, EdgesGeometry, Shape, ExtrudeGeometry, Vector2 } from "three"

export const Model = () => {
    const { observableModel } = useState(store)
    if (!observableModel.ornull) {
        return null
    }

    observableModel.attach(Downgraded)

    const model = observableModel.get() as any
    const edgeGeo = new EdgesGeometry(model)
    edgeGeo.attributes.position.needsUpdate = true
    // positions.array = positions.array.slice(0,18*100)

    const v1 = [-1, -1, 1]
    const v2 = [1, -1, 1]
    const v3 = [-1, 1, 1]
    const v4 = [1, 1, 1]
    const v5 = [1, -1, -1]
    const v6 = [1, 1, -1]
    const v7 = [-1, -1, -1]
    const v8 = [-1, 1, -1]

    const v32 = [-2, 2, 2]
    const v42 = [2, 2, 2]
    const v62 = [2, 2, -2]
    const v82 = [-2, 2, -2]

    const vertices = [
        // front
        { pos: v1, norm: [0, 0, 1], uv: [0, 0], },
        { pos: v2, norm: [0, 0, 1], uv: [1, 0], },
        { pos: v3, norm: [0, 0, 1], uv: [0, 1], },
        { pos: v4, norm: [0, 0, 1], uv: [1, 1], },
        // right
        { pos: v2, norm: [1, 0, 0], uv: [0, 0], },
        { pos: v5, norm: [1, 0, 0], uv: [1, 0], },
        { pos: v4, norm: [1, 0, 0], uv: [0, 1], },
        { pos: v6, norm: [1, 0, 0], uv: [1, 1], },
        // back
        { pos: v5, norm: [0, 0, -1], uv: [0, 0], },
        { pos: v7, norm: [0, 0, -1], uv: [1, 0], },
        { pos: v6, norm: [0, 0, -1], uv: [0, 1], },
        { pos: v8, norm: [0, 0, -1], uv: [1, 1], },
        // left
        { pos: v7, norm: [-1, 0, 0], uv: [0, 0], },
        { pos: v1, norm: [-1, 0, 0], uv: [1, 0], },
        { pos: v8, norm: [-1, 0, 0], uv: [0, 1], },
        { pos: v3, norm: [-1, 0, 0], uv: [1, 1], },
        // top
        { pos: v6, norm: [0, 1, 0], uv: [0, 0], },
        { pos: v8, norm: [0, 1, 0], uv: [1, 0], },
        { pos: v4, norm: [0, 1, 0], uv: [0, 1], },
        { pos: v3, norm: [0, 1, 0], uv: [1, 1], },

        { pos: v62, norm: [0, -1, 0], uv: [0, 0], },
        { pos: v82, norm: [0, -1, 0], uv: [1, 0], },
        { pos: v42, norm: [0, -1, 0], uv: [0, 1], },
        { pos: v32, norm: [0, -1, 0], uv: [1, 1], },

        // bottom
        { pos: v2, norm: [0, -1, 0], uv: [0, 0], },
        { pos: v1, norm: [0, -1, 0], uv: [1, 0], },
        { pos: v5, norm: [0, -1, 0], uv: [0, 1], },
        { pos: v7, norm: [0, -1, 0], uv: [1, 1], },
    ]

    const positions = []
    const normals = []
    const uvs = []
    for (const vertex of vertices) {
        positions.push(...vertex.pos)
        normals.push(...vertex.norm)
        uvs.push(...vertex.uv)
    }

    const geometry = new BufferGeometry()

    /*  geometry.setIndex([
       0,  1,  2,   2,  1,  3,  // front
       4,  5,  6,   6,  5,  7,  // right
       8,  9, 10,  10,  9, 11,  // back
      12, 13, 14,  14, 13, 15,  // left
      16, 17, 18,  18, 17, 19,  // top
      20, 21, 22,  22, 21, 23,  // bottom
    ]) */

    geometry.setIndex([
        0, 1, 2, 2, 1, 3,  // front
        4, 5, 3, 3, 5, 7,  // right
        8, 9, 10, 10, 9, 11,  // back
        12, 13, 14, 14, 13, 15,  // left

        22, 23, 15, 22, 15, 3,  // new front
        7, 20, 3, 22, 3, 20,  // new right
        21, 16, 17, 16, 21, 20,  // new back
        21, 14, 15, 23, 21, 15,  // new left

        16+4, 17+4, 18+4,  18+4, 17+4, 19+4,  // top
        20 + 4, 21 + 4, 22 + 4, 22 + 4, 21 + 4, 23 + 4,  // bottom
    ])
    
    const positionNumComponents = 3
    const normalNumComponents = 3
    const uvNumComponents = 2
    geometry.setAttribute(
        'position',
        new BufferAttribute(new Float32Array(positions), positionNumComponents))
    geometry.setAttribute(
        'normal',
        new BufferAttribute(new Float32Array(normals), normalNumComponents))
    geometry.setAttribute(
        'uv',
        new BufferAttribute(new Float32Array(uvs), uvNumComponents))

    return <mesh geometry={geometry} position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[0.1, 0.1, 0.1]}>
        <meshLambertMaterial attach="material" color="gray" />
        <lineSegments geometry={geometry}>
            <lineBasicMaterial color="orange" depthTest={false} />
        </lineSegments>
        <points geometry={geometry}>
            <pointsMaterial size={0.005} color="red" depthTest={false} />
        </points>
    </mesh>
}
