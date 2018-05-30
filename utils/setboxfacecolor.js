/** http://playground.babylonjs.com/#TGNTGT#24
 * @param {BABYLON.AbstractMesh} box
 * @param {number} faceIndex starts from 0
 * @param {BABYLON.Color4} color
 */
export function setBoxFaceColor (box, faceIndex, color) {
    const kind = box.getVerticesDataKinds().find(k => k === 'color')
    if (!kind) return

    const data = [...box.getVerticesData(kind)]
    const faceVertices = 4 // 4 vertices per face
    const vertexColors = 4 // r g b a
    const faceVerticesColors = faceVertices * vertexColors
    let idx = faceIndex * faceVerticesColors
    const endIdx = (faceIndex + 1) * faceVerticesColors
    if (data.length !== faceVertices * vertexColors * 6) {
        console.warn('The mesh is supposed to be a Box...')
    }
    while (idx < endIdx) {
        data[idx++] = color.r
        data[idx++] = color.g
        data[idx++] = color.b
        data[idx++] = color.a
    }

    box.setVerticesData(kind, data, true)
}
