var createScene = function () {
    var V3 = BABYLON.Vector3
    var scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color3(.5, .5, .5)
    var camera = new BABYLON.ArcRotateCamera('camera1',  0, 0, 0, new BABYLON.Vector3(0, 0, -0), scene)
    camera.setPosition(new BABYLON.Vector3(0, 0, -100))
    camera.attachControl(canvas, true)
    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(1, 0.5, 0), scene)
    light.intensity = 0.7
    var pl = new BABYLON.PointLight('pl', new BABYLON.Vector3(0, 0, 0), scene)
    // pl.diffuse = new BABYLON.Color3(1, 1, 1)
    pl.intensity = 0.95

    var mat = new BABYLON.StandardMaterial('mat1', scene)
    mat.alpha = 1.0
    mat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5)
    mat.backFaceCulling = false
    var txtr = new BABYLON.Texture('https://s2.d2scdn.com/2018/05/26/Fs-lwjlP3YWYkqclI1ZfK-jSd8B8.png')
    txtr.wrapU = BABYLON.Texture.CLAMP_ADDRESSMODE
    txtr.wrapV = BABYLON.Texture.CLAMP_ADDRESSMODE
    mat.opacityTexture = txtr
    mat.specularColor = new BABYLON.Color3(0, 0, 0)
    mat.emissiveColor = new BABYLON.Color3(0, 0, 0)
    // mat.wireframe = true;

    // tube creation
    // var sideOrientation = BABYLON.Mesh.FRONTSIDE
    var radius = 2
    var radiusFix = 1
    var path = []
    var ptCount = 100
    var maxLength = 15
    var ptDistance = maxLength / ptCount
    for(var i = 0; i < ptCount; i++) {
        var x = 0.000001 * i
        var y = 0
        var z = 0
        path.push(new V3(x, y, z))
    }

    var radiusFunction = (i/* , distance */) => radius - (radius - radiusFix) / path.length * i

    var mesh = BABYLON.MeshBuilder.CreateTube('tube', {
        path, radius, radiusFunction,
        sideOrientation: BABYLON.Mesh.BACKSIDE,
        updatable: true,
    }, scene)
    mesh.material = mat

    const subject = BABYLON.MeshBuilder.CreateBox('subject', {size: 4}, scene)
    let clock = 0
    subject.registerAfterWorldMatrixUpdate(trail)
    scene.registerAfterRender(cutTail)

    function trail () {
        const latestPosition = path[0]
        if (latestPosition && V3.Distance(latestPosition, subject.position) < ptDistance) {
            return
        }

        path.pop()
        path.unshift(subject.position)

        // mesh = BABYLON.MeshBuilder.CreateTube(null, {
        //     path,
        //     radiusFunction,
        //     instance: mesh
        // })
    }

    function cutTail () {
        clock++
        if (clock % 5 === 0) {
            path.pop()
            path.unshift(subject.position)
        }
        mesh = BABYLON.MeshBuilder.CreateTube(null, {
            path,
            radiusFunction,
            instance: mesh
        })
    }


    // morphing
    function move () {
        subject.rotation.z += 0.01
        subject.translate(new V3(-1, 0, 0), 0.1, BABYLON.Space.LOCAL)
    }

    scene.registerAfterRender(move)

    // setTimeout(() => scene.unregisterAfterRender(move), 10000)

    return scene
}
