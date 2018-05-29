var createScene = function () { // eslint-disable-line
    var V3 = BABYLON.Vector3
    /* eslint-disable no-unused-vars */
    var scene = new BABYLON.Scene(engine)
    var camera = new BABYLON.ArcRotateCamera('Camera', Math.PI / 3, Math.PI / 3, 50, BABYLON.Vector3.Zero(), scene)
    camera.attachControl(canvas, true)
    var light = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(1, 1, 1), scene)
    /* eslint-disable no-unused-vars */
    const vertex = [
        [ 0,           0,          1.154701],
        [ 1,           0,          0.5773503],
        [ 0.3333333,   0.942809,   0.5773503],
        [-1,           0,          0.5773503],
        [-0.3333333,  -0.942809,   0.5773503],
        [ 1,           0,         -0.5773503],
        [ 0.6666667,  -0.942809,   0],
        [-0.6666667,   0.942809,   0],
        [ 0.3333333,   0.942809,  -0.5773503],
        [-1,           0,         -0.5773503],
        [-0.3333333,  -0.942809,  -0.5773503],
        [ 0,           0,         -1.154701]
    ]
    let face = [ // clockwise
        [0, 1, 2],
        [0, 3, 4],
        [2, 8, 7],
        [0, 2, 7, 3],
        [1, 6, 5],
        [3, 7, 9],
        [5, 11, 8],
        [4, 10, 6],
        [9, 11, 10],
        [0, 4, 6, 1],
        [1, 5, 8, 2],
        [3, 9, 10, 4],
        [5, 6, 10, 11],
        [7, 8, 11, 9]
    ]

    function deleteDot (deletedIndex) {
        let newFace = []
        for (const fi in face) {
            let f = face[fi]
            const newF = f.filter(vertex => vertex !== deletedIndex)
            if (newF.length !== f.length) {
                const vi = f.indexOf(deletedIndex)
                const vLeft = f[vi - 1] === void 0 ? f[f.length - 1] : f[vi - 1]
                const vRight = f[vi + 1] === void 0 ? f[0] : f[vi + 1]
                face[fi] = newF
                // console.log('f', f)
                if (f.length === 3) {
                    newFace.push(vRight)
                    newFace.push(vLeft)
                } else {
                    newFace.push(vLeft)
                    newFace.push(vRight)
                }
            }
        }
        face = face.filter(face => face.length > 2)
        newFace = Array.from(new Set(newFace))
        face.push(newFace)
        console.log(newFace, face)
    }

    deleteDot(0)
    // face = face.map(face => face.map(vertex => vertex - 1).filter(vertex => vertex >= 0)).filter(face => face.length > 2)

    const polySize = 8

    let poly = BABYLON.MeshBuilder.CreatePolyhedron('poly', {
        size: polySize,
        custom: { name: 'custom', category: 'Johnson solid', vertex, face },
        updatable: true
    }, scene)

    const vertices = vertex.map((vtx, index) => {
        const dot = BABYLON.MeshBuilder.CreateSphere('vertex', {
            segments: 10,
            diameter: 1
        })
        dot.position = V3.FromArray(vtx).multiplyByFloats(polySize, polySize, polySize)
        dot.vertexIndex = index
        return dot
    })

    // pick
    let pickedVertex
    let pickedAxis
    let axisPlane
    let axises = getAxis(0, 1, poly, 0, 3)
    let axisM = BABYLON.MeshBuilder.CreateLines('', {points: [V3.Zero(), V3.Zero()], updatable: true}, scene)
    function getPickResult (camera, cb) {
        return scene.pick(scene.pointerX, scene.pointerY, cb, true, camera)
    }
    function updateAxisM (pickedAxis, pickedVertex) {
        const axisName = pickedAxis.name.replace('localAxis', '')
        const axis = BABYLON.Axis[axisName]
        const axisMName = 'axisM' + axisName
        if (axisM.name !== axisMName) {
            axisM = BABYLON.MeshBuilder.CreateLines(null, {
                points: [
                    axis.multiplyByFloats(100, 100, 100),
                    axis.multiplyByFloats(-100, -100, -100)
                ],
                instance: axisM
            })
            axisM.name = axisMName
            axisM.parent = pickedVertex
        }
        return axisM
    }
    function moveDot (pickedAxis, pickedVertex, position) {
        const axisName = pickedAxis.name.replace('localAxis', '')
        const axis = BABYLON.Axis[axisName]
        const distance = position.subtract(pickedVertex.getAbsolutePosition())[axisName.toLowerCase()]
        pickedVertex.translate(axis, distance, BABYLON.Space.LOCAL)

        updatePoly()
    }
    function updatePoly () {
        const vertex = vertices.map(vtx => ['x', 'y', 'z'].map(axis => vtx.position[axis] / polySize))
        // console.log(vertex)
        const positions = []
        const sizeX = polySize
        const sizeY = polySize
        const sizeZ = polySize
        const nbfaces = face.length
        for (let f = 0; f < nbfaces; f++) {
            var fl = face[f].length // number of vertices of the current face
            for (let i = 0; i < fl; i++) {
                positions.push(vertex[face[f][i]][0] * sizeX, vertex[face[f][i]][1] * sizeY, vertex[face[f][i]][2] * sizeZ)
            }
        }

        poly.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions)
    }

    scene.onPointerDown = (evt, pickingInfo) => {
        const pickResult = getPickResult(camera,
            (m) => m.name === 'vertex' || m.name.startsWith('localAxis')
        )

        if (pickResult.hit) {
            // console.log('pickresult', pickResult.pickedMesh.name)
            const pickedMesh = pickResult.pickedMesh
            if (pickedMesh.name === 'vertex') {
                pickedVertex = pickedMesh
                axises.parent = pickedVertex
            } else {
                camera.detachControl(canvas)
                pickedAxis = pickedMesh
                const rotateMap = {
                    'Z': 'y',
                    'Y': 'z',
                    'X': 'z'
                }
                axisPlane = BABYLON.MeshBuilder.CreatePlane('hitBoard', {size: 100}, scene)
                axisPlane.rotation[rotateMap[pickedAxis.name.replace('localAxis', '')]] = Math.PI / 2
                axisPlane.isVisible = false
                axisPlane.parent = pickedMesh.parent
            }
        }
    }

    scene.onPointerMove = (evt, pickingInfo) => {
        // console.log('pickinfo', pickingInfo)
        const pickResult = getPickResult(camera,
            (m) => m.name.startsWith('localAxis') || m.name === 'hitBoard'
        )
        if (pickedAxis) {
            // console.log('--', pickResult.pickedPoint)
            moveDot(pickedAxis, pickedVertex, pickResult.pickedPoint)
        }
    }

    scene.onPointerUp = (evt, pickingInfo) => {
        camera.attachControl(canvas, true)
        pickedAxis = null
        if (axisPlane) {
            axisPlane.dispose()
        }
    }

    scene.registerAfterRender(() => {
        const pickResult = getPickResult(camera,
            (m) => m.name.startsWith('localAxis')
        )

        if (pickedVertex) {
            if (pickResult.hit) {
                if (!pickedAxis) {
                    const pickedAxis = pickResult.pickedMesh
                    updateAxisM(pickedAxis, pickedVertex)
                }
            }
        }
    })

    // AXIS
    getAxis(1, 0, 0, 20)
    // getAxis(1, 1, pilot)
    function getAxis (needGlobalAxis=true, needLocalAxis=false, origin=false, globalSize=8, localSize=2) {
        if (needGlobalAxis) {
            globalAxis(globalSize)
        }
        if (needLocalAxis && origin) {
            const localOrigin = localAxis(localSize)
            localOrigin.parent = origin
            return localOrigin
        }
    }

    function globalAxis (size) {
        function makeTextPlane (text, color, size) {
            const dynamicTexture = new BABYLON.DynamicTexture('DynamicTexture', 50, scene, true)
            dynamicTexture.hasAlpha = true
            dynamicTexture.drawText(text, 5, 40, 'bold 36px Arial', color, 'transparent', true)
            const plane = new BABYLON.Mesh.CreatePlane('TextPlane', size, scene, true)
            plane.material = new BABYLON.StandardMaterial('TextPlaneMaterial', scene)
            plane.material.backFaceCulling = false
            plane.material.specularColor = new BABYLON.Color3(0, 0, 0)
            plane.material.diffuseTexture = dynamicTexture
            return plane
        }

        const axisX = BABYLON.Mesh.CreateLines('axisX', [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
        ], scene)
        axisX.color = new BABYLON.Color3(1, 0, 0)
        const xChar = makeTextPlane('X', 'red', size / 10)
        xChar.position = new BABYLON.Vector3(0.9 * size, -0.05 * size, 0)

        const axisY = BABYLON.Mesh.CreateLines('axisY', [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
        ], scene)
        axisY.color = new BABYLON.Color3(0, 1, 0)
        const yChar = makeTextPlane('Y', 'green', size / 10)
        yChar.position = new BABYLON.Vector3(0, 0.9 * size, -0.05 * size)

        const axisZ = BABYLON.Mesh.CreateLines('axisZ', [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
        ], scene)
        axisZ.color = new BABYLON.Color3(0, 0, 1)
        var zChar = makeTextPlane('Z', 'blue', size / 10)
        zChar.position = new BABYLON.Vector3(0, 0.05 * size, 0.9 * size)
    }

    function localAxis (size) {
        const localAxisX = BABYLON.Mesh.CreateLines('localAxisX', [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, 0.05 * size, 0),
            new BABYLON.Vector3(size, 0, 0), new BABYLON.Vector3(size * 0.95, -0.05 * size, 0)
        ], scene)
        localAxisX.color = new BABYLON.Color3(1, 0, 0)

        const localAxisY = BABYLON.Mesh.CreateLines('localAxisY', [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(-0.05 * size, size * 0.95, 0),
            new BABYLON.Vector3(0, size, 0), new BABYLON.Vector3(0.05 * size, size * 0.95, 0)
        ], scene)
        localAxisY.color = new BABYLON.Color3(0, 1, 0)

        const localAxisZ = BABYLON.Mesh.CreateLines('localAxisZ', [
            new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, -0.05 * size, size * 0.95),
            new BABYLON.Vector3(0, 0, size), new BABYLON.Vector3(0, 0.05 * size, size * 0.95)
        ], scene)
        localAxisZ.color = new BABYLON.Color3(0, 0, 1)

        const localOrigin = BABYLON.MeshBuilder.CreateBox('localOrigin', {size: 1}, scene)
        localOrigin.isVisible = false

        localAxisX.parent = localOrigin
        localAxisY.parent = localOrigin
        localAxisZ.parent = localOrigin
        // localAxisZM.parent = localOrigin

        return localOrigin
    }
    // }
    return scene
}