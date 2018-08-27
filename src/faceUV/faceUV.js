var createScene = function () {
    var scene = new BABYLON.Scene(engine)
    scene.clearColor = new BABYLON.Color3(.5, .5, .5)

    // camera
    var camera = new BABYLON.ArcRotateCamera('camera1', 0, 0, 0, new BABYLON.Vector3(0, 0, -0), scene)
    camera.setPosition(new BABYLON.Vector3(0, 0, -4))
    camera.attachControl(canvas, true)

    var light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene)
    light.intensity = 0.7

    var pl = new BABYLON.PointLight('pl', BABYLON.Vector3.Zero(), scene)
    pl.intensity = 0.5


    var mat = new BABYLON.StandardMaterial('mat', scene)
    var texture = new BABYLON.Texture('https://i.imgur.com/7jDxfj0.jpg', scene)
    mat.diffuseTexture = texture

    // var columns = 6  // 6 columns
    // var rows = 1  // 1 row

    //alien sprite
    var faceUV = new Array(6)

    const orders = [
        [1 / 6, 1, 0 / 6, 0],
        [1 / 6, 0, 2 / 6, 1],
        [2 / 6, 0, 3 / 6, 1],
        [3 / 6, 0, 4 / 6, 1],
        [4 / 6, 0, 5 / 6, 1],
        [5 / 6, 0, 6 / 6, 1],
    ]
    faceUV = orders.map(i => new BABYLON.Vector4(...i))

    var options = {
        faceUV: faceUV,
        updatable: true
    }

    var box = BABYLON.MeshBuilder.CreateBox('box', options, scene)
    box.scaling.y = 0.5
    box.material = mat

    scene.registerBeforeRender(function () {
        pl.position = camera.position
    })



    {   // AXIS
        getAxis(1, 1, box)

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

            const localAxisZM = BABYLON.Mesh.CreateLines('localAxisZ', [
                new BABYLON.Vector3.Zero(), new BABYLON.Vector3(0, 0, -15)
            ], scene)
            localAxisZ.color = new BABYLON.Color3(0, 0, 1)

            const localOrigin = BABYLON.MeshBuilder.CreateBox('localOrigin', {size: 1}, scene)
            localOrigin.isVisible = false

            localAxisX.parent = localOrigin
            localAxisY.parent = localOrigin
            localAxisZ.parent = localOrigin
            localAxisZM.parent = localOrigin

            return localOrigin
        }

        function getAxis (needGlobalAxis=true, needLocalAxis=false, origin=false, globalSize=8, localSize=2) {
            if (needGlobalAxis) {
                globalAxis(globalSize)
            }
            if (needLocalAxis && origin) {
                const localOrigin = localAxis(localSize)
                localOrigin.parent = origin
            }
        }
    }




    return scene
}
