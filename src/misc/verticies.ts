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

export const vertices = [
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
